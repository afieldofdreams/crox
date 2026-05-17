import type { APIRoute } from 'astro';
import { ASSESSMENT_QUESTIONS, MAX_SCORE, calculateScore, scoreToBand } from '../../lib/assessment';
import { createFiberyLead, type AssessmentSubmission } from '../../lib/fibery';
import { sendAssessmentEmail } from '../../lib/email';

export const prerender = false;

const MAX_LEN = 200;

function json(status: number, body: unknown) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export const POST: APIRoute = async ({ request }) => {
  let payload: any;
  try {
    payload = await request.json();
  } catch {
    return json(400, { error: 'Invalid JSON' });
  }

  // Honeypot
  if (typeof payload.website === 'string' && payload.website.trim() !== '') {
    return json(200, { ok: true });
  }

  const name = String(payload.name || '').trim().slice(0, MAX_LEN);
  const email = String(payload.email || '').trim().slice(0, MAX_LEN);
  const company = String(payload.company || '').trim().slice(0, MAX_LEN);
  const answers = payload.answers && typeof payload.answers === 'object' ? payload.answers : {};

  if (!name) return json(400, { error: 'Name is required' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json(400, { error: 'Valid email is required' });
  }

  // Recompute score server-side; never trust client.
  const cleanAnswers: Record<string, number> = {};
  const breakdown: AssessmentSubmission['breakdown'] = [];
  for (const q of ASSESSMENT_QUESTIONS) {
    const raw = answers[q.id];
    const idx = typeof raw === 'number' && raw >= 0 && raw < q.options.length ? raw : -1;
    if (idx === -1) {
      return json(400, { error: `Missing or invalid answer for "${q.id}"` });
    }
    cleanAnswers[q.id] = idx;
    breakdown.push({
      pillar: q.pillar,
      prompt: q.prompt,
      answer: q.options[idx].label,
      score: q.options[idx].score,
    });
  }
  const score = calculateScore(cleanAnswers);
  const band = scoreToBand(score);

  const submission: AssessmentSubmission = {
    name,
    email,
    company,
    score,
    maxScore: MAX_SCORE,
    band: band.name,
    breakdown,
    submittedAt: new Date().toISOString(),
  };

  // Try Fibery first so we can include the deal id in the email. If Fibery
  // fails, still send the email so the lead isn't lost — and log both.
  let fiberyIds: { contactPublicId?: string; dealPublicId?: string } = {};
  const failures: string[] = [];
  try {
    fiberyIds = await createFiberyLead(submission);
  } catch (e) {
    failures.push(`fibery:${e instanceof Error ? e.message : String(e)}`);
    console.error('Fibery create failed:', e);
  }

  try {
    await sendAssessmentEmail(submission, fiberyIds);
  } catch (e) {
    failures.push(`email:${e instanceof Error ? e.message : String(e)}`);
    console.error('Email send failed:', e);
  }

  if (failures.length === 2) {
    return json(500, { error: 'Could not record your submission. Please email adam@crox.io.' });
  }

  return json(200, { ok: true, score, band: band.name, partial: failures.length > 0 });
};
