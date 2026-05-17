// Minimal Fibery client for inbound assessment submissions.
//
// Creates one CRM/Contact and one CRM/Deal (linked to the Contact).
// Source = "Inbound" — see CRM/Source_CRM/Deal enum.
// All scoring detail is written into the deal description document.

const SOURCE_INBOUND_ID = '66e6d0a7-1c94-49db-b916-fa70be71e9fb';
const PIPELINE_CROX_DIRECT_ID = 'd9c8ef04-d670-445b-9ea1-9d2a61f2f589';

interface FiberyCommandResult<T = unknown> {
  success: boolean;
  result?: T;
  message?: string;
}

interface CreatedEntity {
  'fibery/id': string;
  'fibery/public-id'?: string;
}

async function callFibery<T = unknown>(
  host: string,
  token: string,
  commands: unknown[],
): Promise<FiberyCommandResult<T>[]> {
  const res = await fetch(`https://${host}/api/commands`, {
    method: 'POST',
    headers: {
      Authorization: `Token ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(commands),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Fibery ${res.status}: ${text}`);
  }
  return (await res.json()) as FiberyCommandResult<T>[];
}

export interface AssessmentSubmission {
  name: string;
  email: string;
  company: string;
  score: number;
  maxScore: number;
  band: string;
  breakdown: Array<{ pillar: string; prompt: string; answer: string; score: number }>;
  submittedAt: string;
}

export async function createFiberyLead(submission: AssessmentSubmission): Promise<{
  contactPublicId?: string;
  dealPublicId?: string;
}> {
  const host = process.env.FIBERY_HOST;
  const token = process.env.FIBERY_TOKEN;
  if (!host || !token) {
    throw new Error('Missing FIBERY_HOST or FIBERY_TOKEN env var');
  }

  const contactRes = await callFibery<CreatedEntity>(host, token, [
    {
      command: 'fibery.entity/create',
      args: {
        type: 'CRM/Contact',
        entity: {
          'CRM/Name': submission.name,
          'CRM/Email': submission.email,
          'CRM/First Visit': submission.submittedAt,
          'CRM/Last Visit': submission.submittedAt,
        },
      },
    },
  ]);
  const contact = contactRes[0]?.result;
  if (!contact?.['fibery/id']) {
    throw new Error(`Fibery contact create failed: ${JSON.stringify(contactRes)}`);
  }

  const dealName = submission.company
    ? `Assessment: ${submission.company} (${submission.score}/${submission.maxScore})`
    : `Assessment: ${submission.name} (${submission.score}/${submission.maxScore})`;

  const dealRes = await callFibery<CreatedEntity & { 'CRM/Description'?: { 'fibery/id': string; 'Collaboration~Documents/secret': string } }>(
    host,
    token,
    [
      {
        command: 'fibery.entity/create',
        args: {
          type: 'CRM/Deal',
          entity: {
            'CRM/Name': dealName,
            'CRM/Source': { 'fibery/id': SOURCE_INBOUND_ID },
            'CRM/Pipeline': { 'fibery/id': PIPELINE_CROX_DIRECT_ID },
          },
        },
      },
    ],
  );
  const deal = dealRes[0]?.result;
  if (!deal?.['fibery/id']) {
    throw new Error(`Fibery deal create failed: ${JSON.stringify(dealRes)}`);
  }

  await callFibery(host, token, [
    {
      command: 'fibery.entity/add-collection-items',
      args: {
        type: 'CRM/Deal',
        entity: { 'fibery/id': deal['fibery/id'] },
        field: 'CRM/Contacts',
        items: [{ 'fibery/id': contact['fibery/id'] }],
      },
    },
  ]).catch((e) => {
    // Non-fatal: contact and deal exist, just unlinked. Log to stderr.
    console.error('Failed to link contact to deal:', e);
  });

  const descriptionSecret = deal['CRM/Description']?.['Collaboration~Documents/secret'];
  if (descriptionSecret) {
    const body = renderDealDescription(submission);
    await fetch(`https://${host}/api/documents/${descriptionSecret}?format=md`, {
      method: 'PUT',
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: body }),
    }).catch((e) => {
      console.error('Failed to set deal description:', e);
    });
  }

  return {
    contactPublicId: contact['fibery/public-id'],
    dealPublicId: deal['fibery/public-id'],
  };
}

function renderDealDescription(s: AssessmentSubmission): string {
  const lines: string[] = [];
  lines.push(`# AI Readiness Scorecard submission`);
  lines.push('');
  lines.push(`**Score:** ${s.score} / ${s.maxScore} — *${s.band}*`);
  lines.push(`**Submitted:** ${s.submittedAt}`);
  lines.push('');
  lines.push(`**Name:** ${s.name}`);
  lines.push(`**Email:** ${s.email}`);
  if (s.company) lines.push(`**Company:** ${s.company}`);
  lines.push('');
  lines.push(`## Answers`);
  for (const row of s.breakdown) {
    lines.push('');
    lines.push(`**${row.pillar}** — *${row.score}/3*`);
    lines.push(`> ${row.prompt}`);
    lines.push('');
    lines.push(row.answer);
  }
  return lines.join('\n');
}
