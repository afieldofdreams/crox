export interface AssessmentOption {
  label: string;
  score: 0 | 1 | 2 | 3;
}

export interface AssessmentQuestion {
  id: string;
  pillar: string;
  prompt: string;
  options: AssessmentOption[];
}

export const ASSESSMENT_QUESTIONS: AssessmentQuestion[] = [
  {
    id: 'data',
    pillar: 'Data',
    prompt: 'How organised is your business data today?',
    options: [
      { label: 'Scattered across email, spreadsheets and individual heads', score: 0 },
      { label: 'Some systems of record, but data lives in silos', score: 1 },
      { label: 'Most data in connected systems, some cleanup needed', score: 2 },
      { label: 'Well-structured, accessible and reliably maintained', score: 3 },
    ],
  },
  {
    id: 'process',
    pillar: 'Process',
    prompt: 'How well-documented are the processes you would want AI to assist with?',
    options: [
      { label: "Tacit knowledge — it lives in people's heads", score: 0 },
      { label: 'Documented in places, but outdated or incomplete', score: 1 },
      { label: 'Documented and broadly accurate for core workflows', score: 2 },
      { label: 'Documented, current and measured — clear inputs and outputs', score: 3 },
    ],
  },
  {
    id: 'team',
    pillar: 'Team capability',
    prompt: 'How comfortable is your team with adopting new digital tools?',
    options: [
      { label: 'Significant resistance — past changes have struggled', score: 0 },
      { label: 'Mixed — some early adopters, some hold-outs', score: 1 },
      { label: "Generally adaptive — adoption isn't usually the blocker", score: 2 },
      { label: 'Actively use new tools and propose changes themselves', score: 3 },
    ],
  },
  {
    id: 'governance',
    pillar: 'Governance & risk',
    prompt: 'Do you have a clear view of what is at stake if AI gets something wrong in your context?',
    options: [
      { label: "We haven't really thought about it yet", score: 0 },
      { label: "We've discussed it but nothing's written down", score: 1 },
      { label: 'We have a basic policy or AUP, plus some named risks', score: 2 },
      { label: 'Documented risk register, named owners, review cadence', score: 3 },
    ],
  },
  {
    id: 'use_case',
    pillar: 'Use-case clarity',
    prompt: 'How specific is your idea of what AI should do for your organisation?',
    options: [
      { label: "We just know we should be doing 'something'", score: 0 },
      { label: 'A few candidate ideas, no priority', score: 1 },
      { label: 'One or two clear use-cases with rough business value', score: 2 },
      { label: 'A prioritised use-case with measurable value and exec sponsorship', score: 3 },
    ],
  },
];

export const MAX_SCORE = ASSESSMENT_QUESTIONS.length * 3;

export interface Band {
  name: string;
  range: [number, number];
  headline: string;
  description: string;
  recommendation: string;
}

export const BANDS: Band[] = [
  {
    name: 'Early',
    range: [0, 5],
    headline: 'Foundations first.',
    description:
      "You're at the start of the journey. Most teams here over-spend on AI tooling before the basics — data, documented processes, and a shared view of risk — are in place. Doing that groundwork first makes everything later cheaper and faster.",
    recommendation: 'Education and basic governance before any pilot. Avoid signing AI contracts this quarter.',
  },
  {
    name: 'Mixed',
    range: [6, 10],
    headline: 'Pockets of readiness — needs a plan.',
    description:
      "You have some of the pieces but they're uneven. A common pattern: solid data in one area, tacit knowledge in another; some appetite, no shared plan. The risk isn't doing nothing — it's doing the wrong thing first.",
    recommendation: 'A structured Readiness Assessment to sequence what to fix and what to try.',
  },
  {
    name: 'Strong',
    range: [11, 15],
    headline: 'Ready to experiment — carefully.',
    description:
      "You have the foundations. The work now is choosing the right first use-case, wiring it to your real systems, and building guardrails that survive contact with production. This is the stage where most organisations either compound their advantage or burn time on the wrong pilot.",
    recommendation: 'Run a tightly-scoped Experiment on one high-value use-case with governance baked in from day one.',
  },
];

export function scoreToBand(score: number): Band {
  return BANDS.find((b) => score >= b.range[0] && score <= b.range[1]) ?? BANDS[0];
}

export function calculateScore(answers: Record<string, number>): number {
  let total = 0;
  for (const q of ASSESSMENT_QUESTIONS) {
    const idx = answers[q.id];
    if (typeof idx === 'number' && idx >= 0 && idx < q.options.length) {
      total += q.options[idx].score;
    }
  }
  return total;
}
