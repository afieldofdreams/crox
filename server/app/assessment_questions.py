"""Five-question AI Readiness Scorecard — server-side source of truth.

The client renders an identical copy of these questions (in TypeScript),
but the server scores its own submission using this module so a
tampered client payload can't manufacture a 15/15.

If the questions change, both copies must be updated. The schema is
stable: each question has an `id`, `pillar`, `prompt`, and four
`options` ordered worst-to-best with scores 0..3. Don't reorder
options — the client sends back option index, not score.
"""
from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class Option:
    label: str
    score: int  # 0..3


@dataclass(frozen=True)
class Question:
    id: str
    pillar: str
    prompt: str
    options: tuple[Option, ...]


@dataclass(frozen=True)
class Band:
    name: str
    range: tuple[int, int]
    headline: str
    description: str
    recommendation: str


ASSESSMENT_QUESTIONS: tuple[Question, ...] = (
    Question(
        id="data",
        pillar="Data",
        prompt="How organised is your business data today?",
        options=(
            Option("Scattered across email, spreadsheets and individual heads", 0),
            Option("Some systems of record, but data lives in silos", 1),
            Option("Most data in connected systems, some cleanup needed", 2),
            Option("Well-structured, accessible and reliably maintained", 3),
        ),
    ),
    Question(
        id="process",
        pillar="Process",
        prompt="How well-documented are the processes you would want AI to assist with?",
        options=(
            Option("Tacit knowledge — it lives in people's heads", 0),
            Option("Documented in places, but outdated or incomplete", 1),
            Option("Documented and broadly accurate for core workflows", 2),
            Option("Documented, current and measured — clear inputs and outputs", 3),
        ),
    ),
    Question(
        id="team",
        pillar="Team capability",
        prompt="How comfortable is your team with adopting new digital tools?",
        options=(
            Option("Significant resistance — past changes have struggled", 0),
            Option("Mixed — some early adopters, some hold-outs", 1),
            Option("Generally adaptive — adoption isn't usually the blocker", 2),
            Option("Actively use new tools and propose changes themselves", 3),
        ),
    ),
    Question(
        id="governance",
        pillar="Governance & risk",
        prompt="Do you have a clear view of what is at stake if AI gets something wrong in your context?",
        options=(
            Option("We haven't really thought about it yet", 0),
            Option("We've discussed it but nothing's written down", 1),
            Option("We have a basic policy or AUP, plus some named risks", 2),
            Option("Documented risk register, named owners, review cadence", 3),
        ),
    ),
    Question(
        id="use_case",
        pillar="Use-case clarity",
        prompt="How specific is your idea of what AI should do for your organisation?",
        options=(
            Option("We just know we should be doing 'something'", 0),
            Option("A few candidate ideas, no priority", 1),
            Option("One or two clear use-cases with rough business value", 2),
            Option("A prioritised use-case with measurable value and exec sponsorship", 3),
        ),
    ),
)


MAX_SCORE = sum(max(o.score for o in q.options) for q in ASSESSMENT_QUESTIONS)


BANDS: tuple[Band, ...] = (
    Band(
        name="Early",
        range=(0, 5),
        headline="Foundations first.",
        description=(
            "You're at the start of the journey. Most teams here over-spend on AI tooling "
            "before the basics — data, documented processes, and a shared view of risk — "
            "are in place. Doing that groundwork first makes everything later cheaper and faster."
        ),
        recommendation="Education and basic governance before any pilot. Avoid signing AI contracts this quarter.",
    ),
    Band(
        name="Mixed",
        range=(6, 10),
        headline="Pockets of readiness — needs a plan.",
        description=(
            "You have some of the pieces but they're uneven. A common pattern: solid data "
            "in one area, tacit knowledge in another; some appetite, no shared plan. The "
            "risk isn't doing nothing — it's doing the wrong thing first."
        ),
        recommendation="A structured AI Mapping engagement to sequence what to fix and what to try.",
    ),
    Band(
        name="Strong",
        range=(11, 15),
        headline="Ready to experiment — carefully.",
        description=(
            "You have the foundations. The work now is choosing the right first use-case, "
            "wiring it to your real systems, and building guardrails that survive contact "
            "with production. This is the stage where most organisations either compound "
            "their advantage or burn time on the wrong pilot."
        ),
        recommendation="Run a tightly-scoped Experiment on one high-value use-case with governance baked in from day one.",
    ),
)


def score_to_band(score: int) -> Band:
    for b in BANDS:
        lo, hi = b.range
        if lo <= score <= hi:
            return b
    # Score outside expected range — return the closest band. Defensive
    # only; the server clamps inputs via Pydantic before this is called.
    return BANDS[0] if score < 0 else BANDS[-1]
