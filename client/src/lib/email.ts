import type { AssessmentSubmission } from './fibery';

export async function sendAssessmentEmail(
  submission: AssessmentSubmission,
  fiberyIds: { contactPublicId?: string; dealPublicId?: string },
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.ASSESSMENT_TO_EMAIL || 'adam@crox.io';
  const from = process.env.ASSESSMENT_FROM_EMAIL || 'Crox Assessment <onboarding@resend.dev>';

  if (!apiKey) {
    throw new Error('Missing RESEND_API_KEY env var');
  }

  const subject = `[Assessment] ${submission.name} — ${submission.score}/${submission.maxScore} (${submission.band})${submission.company ? ` — ${submission.company}` : ''}`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: submission.email,
      subject,
      text: renderTextBody(submission, fiberyIds),
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Resend ${res.status}: ${text}`);
  }
}

function renderTextBody(
  s: AssessmentSubmission,
  ids: { contactPublicId?: string; dealPublicId?: string },
): string {
  const lines: string[] = [];
  lines.push(`Score: ${s.score} / ${s.maxScore} — ${s.band}`);
  lines.push(`Submitted: ${s.submittedAt}`);
  lines.push('');
  lines.push(`Name: ${s.name}`);
  lines.push(`Email: ${s.email}`);
  if (s.company) lines.push(`Company: ${s.company}`);
  lines.push('');
  if (ids.dealPublicId) lines.push(`Fibery Deal: #${ids.dealPublicId}`);
  if (ids.contactPublicId) lines.push(`Fibery Contact: #${ids.contactPublicId}`);
  lines.push('');
  lines.push('--- Answers ---');
  for (const row of s.breakdown) {
    lines.push('');
    lines.push(`[${row.score}/3] ${row.pillar}`);
    lines.push(`Q: ${row.prompt}`);
    lines.push(`A: ${row.answer}`);
  }
  lines.push('');
  lines.push('--');
  lines.push('Reply directly to respond to this person.');
  return lines.join('\n');
}
