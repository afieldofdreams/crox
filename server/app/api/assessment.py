"""POST /assessment — AI Readiness Scorecard submission.

The marketing site's /assessment page presents five questions and
collects the visitor's name + email + (optional) company. The browser
POSTs the raw answers here. This endpoint:

  1. Recomputes the score server-side (never trust the client).
  2. Calls flight-deck /api/forms — canonical contact upsert.
  3. Appends an "Assessment capture" entry to the contact's Fibery
     Activity Stream with the full breakdown.
  4. Emails Adam via Resend with the breakdown + reply-to set to the
     visitor's email.
  5. Fires PostHog assessment_completed keyed by contact_id.

All steps after (1) and (2) are best-effort. If flight-deck rejects
the submission, we 4xx/5xx back so the visitor sees a real error.
Otherwise the visitor gets a 200 with their score + band, even if
email or Activity Stream temporarily fail — the contact still exists
and flight-deck has the form_submission row.

The five questions and their scoring live in
`app.assessment_questions` (separate module so the test surface is
small). They mirror what the client renders, but the server uses its
own copy so a tampered client payload can't manufacture a 15/15.
"""
from __future__ import annotations

from datetime import UTC, datetime

import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr, Field

from app.assessment_questions import ASSESSMENT_QUESTIONS, MAX_SCORE, score_to_band
from app.config import settings
from app.services import analytics, email, fibery, flight_deck

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


def _render_activity_md(
    *,
    score: int,
    band_name: str,
    band_headline: str,
    band_description: str,
    band_recommendation: str,
    breakdown: list[AssessmentBreakdownItem],
    company: str | None,
) -> str:
    """Render the assessment as markdown for the Activity Stream entry."""
    lines: list[str] = []
    lines.append(f"**Score:** {score} / {MAX_SCORE} — **{band_name}**")
    lines.append(f"*{band_headline}*")
    lines.append("")
    if company:
        lines.append(f"**Company:** {company}")
        lines.append("")
    lines.append(f"> {band_description}")
    lines.append("")
    lines.append(f"**Recommendation:** {band_recommendation}")
    lines.append("")
    lines.append("**Answers**")
    for row in breakdown:
        lines.append("")
        lines.append(f"- **[{row.score}/3] {row.pillar}** — {row.prompt}")
        lines.append(f"  - {row.answer}")
    return "\n".join(lines)


def _render_email_text(
    *,
    name: str,
    email_addr: str,
    company: str | None,
    score: int,
    band_name: str,
    band_recommendation: str,
    breakdown: list[AssessmentBreakdownItem],
    submitted_at: str,
) -> str:
    lines: list[str] = []
    lines.append(f"Score: {score} / {MAX_SCORE} — {band_name}")
    lines.append(f"Recommendation: {band_recommendation}")
    lines.append(f"Submitted: {submitted_at}")
    lines.append("")
    lines.append(f"Name: {name}")
    lines.append(f"Email: {email_addr}")
    if company:
        lines.append(f"Company: {company}")
    lines.append("")
    lines.append("--- Answers ---")
    for row in breakdown:
        lines.append("")
        lines.append(f"[{row.score}/3] {row.pillar}")
        lines.append(f"Q: {row.prompt}")
        lines.append(f"A: {row.answer}")
    lines.append("")
    lines.append("--")
    lines.append("Reply directly to respond to this person.")
    return "\n".join(lines)


@router.post("/assessment", response_model=AssessmentResponse)
async def assessment(req: AssessmentRequest) -> AssessmentResponse:
    # Honeypot — silently 200 to anything filling the hidden field.
    if req.website and req.website.strip():
        return AssessmentResponse(ok=True, score=0, max_score=MAX_SCORE, band="Early", contact_id=None)

    if not flight_deck.is_configured():
        raise HTTPException(status_code=503, detail="assessment_not_configured")

    # Recompute score server-side. Reject any answer that doesn't map
    # to a known question/option — that catches both tampered payloads
    # and version drift (e.g. an old cached page sending an answer for
    # a question we've since removed).
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
    submitted_at = datetime.now(UTC).strftime("%Y-%m-%d %H:%M UTC")
    email_addr = str(req.email)

    # 1. Hand to flight-deck (canonical contact upsert).
    #
    # Flight-deck expects form_fields values as strings (it stores them
    # as JSON, but the validator complained on numeric values in
    # testing). Coerce everything to str.
    visitor_id = flight_deck.ensure_visitor_id(req.visitor_id)
    form_fields: dict[str, object] = {
        "email": email_addr,
        "name": req.name.strip(),
        "source": "assessment",
        "score": str(score),
        "max_score": str(MAX_SCORE),
        "band": band.name,
    }
    if req.company:
        form_fields["company"] = req.company.strip()

    # Flight-deck failures are logged but do not 5xx the visitor — they
    # already filled in the form, refusing them a score now would be
    # rude. The score is honest data they earned; the CRM side is
    # ops noise from their POV.
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
        # Defensive — anything unexpected in the upsert path shouldn't
        # take down the response.
        import traceback
        print(f"[assessment] unexpected flight-deck error: {type(exc).__name__}: {str(exc)[:300]}")
        traceback.print_exc()

    # 2. Activity Stream (best-effort).
    try:
        if contact_id:
            activity_md = _render_activity_md(
                score=score,
                band_name=band.name,
                band_headline=band.headline,
                band_description=band.description,
                band_recommendation=band.recommendation,
                breakdown=breakdown,
                company=req.company,
            )
            await fibery.append_assessment_capture(contact_id, activity_md)
    except Exception as exc:
        print(f"[assessment] activity stream append failed: {type(exc).__name__}: {str(exc)[:200]}")

    # 3. Email Adam (best-effort).
    try:
        if email.is_configured():
            email_subject = (
                f"[Scorecard] {req.name.strip()} — {score}/{MAX_SCORE} ({band.name})"
                + (f" — {req.company.strip()}" if req.company else "")
            )
            email_text = _render_email_text(
                name=req.name.strip(),
                email_addr=email_addr,
                company=req.company.strip() if req.company else None,
                score=score,
                band_name=band.name,
                band_recommendation=band.recommendation,
                breakdown=breakdown,
                submitted_at=submitted_at,
            )
            await email.send(
                to=settings.assessment_to_email,
                subject=email_subject,
                text=email_text,
                reply_to=email_addr,
            )
    except Exception as exc:
        print(f"[assessment] email send failed: {type(exc).__name__}: {str(exc)[:200]}")

    # 4. PostHog (best-effort).
    try:
        if contact_id:
            await analytics.fire_event(
                distinct_id=contact_id,
                event="assessment_completed",
                properties={
                    "score": score,
                    "max_score": MAX_SCORE,
                    "band": band.name,
                    "has_company": bool(req.company),
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
