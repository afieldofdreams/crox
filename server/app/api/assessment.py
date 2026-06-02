"""POST /assessment — AI Readiness Scorecard submission.

The marketing site's /assessment page presents five questions and
collects the visitor's name + email + (optional) company. The browser
POSTs the raw answers here. This endpoint:

  1. Recomputes the score server-side (never trust the client).
  2. Calls flight-deck /api/forms — identity resolution + engagement merge.
  3. Persists the full submission (answers + breakdown JSON) to
     crox-chat-db's assessment_submissions table.
  4. Fires PostHog assessment_completed keyed by contact_id.

The visitor always sees their score even if flight-deck or PostHog
fails downstream — they earned it by answering five questions.

The Flight Deck admin reads assessment_submissions when rendering the
Crox leads view. The 'email Adam the result' Resend path that used to
live here was removed when we moved off Fibery — Adam reads the lead
in Flight Deck and replies via the admin's email-send button instead.

The five questions and their scoring live in
`app.assessment_questions` (separate module so the test surface is
small). They mirror what the client renders, but the server uses its
own copy so a tampered client payload can't manufacture a 15/15.
"""
from __future__ import annotations

import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr, Field

from app.assessment_questions import ASSESSMENT_QUESTIONS, MAX_SCORE, score_to_band
from app.services import analytics, db, flight_deck

router = APIRouter()


class AssessmentRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    email: EmailStr
    company: str | None = Field(None, max_length=200)
    # answers: { question_id: option_index }
    answers: dict[str, int] = Field(..., min_length=1, max_length=20)
    page_url: str = Field("", max_length=2000)
    visitor_id: str | None = None
    contact_ref: str | None = None
    # Honeypot — must be empty/missing for real submissions.
    website: str | None = Field(None, max_length=200)


class AssessmentBreakdownItem(BaseModel):
    pillar: str
    prompt: str
    answer: str
    score: int


class AssessmentResponse(BaseModel):
    ok: bool
    score: int
    max_score: int
    band: str
    contact_id: str | None = None


@router.post("/assessment", response_model=AssessmentResponse)
async def assessment(req: AssessmentRequest) -> AssessmentResponse:
    # Honeypot — silently 200 to anything filling the hidden field.
    if req.website and req.website.strip():
        return AssessmentResponse(ok=True, score=0, max_score=MAX_SCORE, band="Early", contact_id=None)

    if not flight_deck.is_configured():
        raise HTTPException(status_code=503, detail="assessment_not_configured")

    # Recompute score server-side. Reject any answer that doesn't map
    # to a known question/option — catches tampered payloads and
    # version drift (cached client sending an answer for a removed question).
    breakdown: list[AssessmentBreakdownItem] = []
    score = 0
    for q in ASSESSMENT_QUESTIONS:
        raw = req.answers.get(q.id)
        if not isinstance(raw, int) or raw < 0 or raw >= len(q.options):
            raise HTTPException(status_code=400, detail=f"invalid_answer:{q.id}")
        opt = q.options[raw]
        breakdown.append(AssessmentBreakdownItem(
            pillar=q.pillar, prompt=q.prompt, answer=opt.label, score=opt.score,
        ))
        score += opt.score

    band = score_to_band(score)
    email_addr = str(req.email)
    name = req.name.strip()
    company = req.company.strip() if req.company else None

    # 1. Hand to flight-deck (identity resolution + engagement merge).
    # Flight-deck wants form_fields values as strings.
    visitor_id = flight_deck.ensure_visitor_id(req.visitor_id)
    form_fields: dict[str, object] = {
        "email": email_addr,
        "name": name,
        "source": "assessment",
        "score": str(score),
        "max_score": str(MAX_SCORE),
        "band": band.name,
    }
    if company:
        form_fields["company"] = company

    # Flight-deck failures are logged but do not 5xx the visitor.
    contact_id: str | None = None
    try:
        result = await flight_deck.submit_form(
            visitor_id=visitor_id,
            page_url=req.page_url or "https://crox.io/assessment",
            form_fields=form_fields,
            contact_ref=req.contact_ref,
        )
        contact_id = result.get("contact_id")
    except httpx.HTTPStatusError as exc:
        body = exc.response.text[:300] if exc.response is not None else ""
        print(f"[assessment] flight-deck rejected {exc.response.status_code if exc.response else '?'}: {body}")
    except httpx.RequestError as exc:
        print(f"[assessment] flight-deck unreachable: {type(exc).__name__}: {str(exc)[:200]}")
    except Exception as exc:
        import traceback
        print(f"[assessment] unexpected flight-deck error: {type(exc).__name__}: {str(exc)[:300]}")
        traceback.print_exc()

    # 2. Persist to Postgres — the canonical Crox CRM record. Always
    # write, even if flight-deck failed; the local row is what Flight
    # Deck's admin view will show.
    try:
        await db.insert_assessment_submission(
            name=name,
            email=email_addr,
            company=company,
            score=score,
            max_score=MAX_SCORE,
            band=band.name,
            answers=req.answers,
            breakdown=[item.model_dump() for item in breakdown],
            page_url=req.page_url or None,
            visitor_id=visitor_id,
            contact_ref=req.contact_ref,
            contact_id=contact_id,
        )
    except Exception as exc:
        print(f"[assessment] db insert failed: {type(exc).__name__}: {str(exc)[:200]}")

    # 3. PostHog (best-effort).
    try:
        if contact_id:
            await analytics.fire_event(
                distinct_id=contact_id,
                event="assessment_completed",
                properties={
                    "score": score,
                    "max_score": MAX_SCORE,
                    "band": band.name,
                    "has_company": bool(company),
                    "page_url": req.page_url,
                    "visitor_id": visitor_id,
                },
            )
    except Exception as exc:
        print(f"[assessment] posthog fire failed: {type(exc).__name__}: {str(exc)[:200]}")

    return AssessmentResponse(
        ok=True,
        score=score,
        max_score=MAX_SCORE,
        band=band.name,
        contact_id=contact_id,
    )
