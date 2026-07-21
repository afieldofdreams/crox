// Reusable contact form. Drops into any Astro page as a React island.
//
// Posts to chat.crox.io/contact-form which runs the same flight-deck →
// Fibery → PostHog plumbing as the chat widget's /capture endpoint.
// Each submission becomes a labelled "Contact form" entry in the CRM
// contact's Activity Stream.
//
// Reads window.croxAttribution (set by flight-deck/track.js) to pass
// the visitor_id and contact_ref through so submissions tie to the same
// browser-side tracking identity as everything else on the site.

import { useState } from 'react';

declare global {
  interface Window {
    croxAttribution?: { visitorId?: string; contactId?: string };
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const DEFAULT_CHAT_BASE_URL = 'https://chat.crox.io';

interface Props {
  chatBaseUrl?: string;
  // Heading + subheading the host page wants above the fields. Optional —
  // the form can be embedded in a section that already has its own copy.
  heading?: string;
  subheading?: string;
  // Submit button copy.
  submitLabel?: string;
  // Override the message-field placeholder for context-specific framings
  // (e.g. on /mapping: "What's the most urgent thing you're trying to
  // figure out?").
  messagePlaceholder?: string;
}

type Status =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success'; email: string }
  | { kind: 'error'; message: string };

export default function ContactForm({
  chatBaseUrl = DEFAULT_CHAT_BASE_URL,
  heading,
  subheading,
  submitLabel = 'Send',
  messagePlaceholder = 'A few lines about what you\'re trying to do. The more specific, the better.',
}: Props) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>({ kind: 'idle' });
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; message?: string }>({});

  function validate(): boolean {
    const errs: typeof fieldErrors = {};
    if (!EMAIL_RE.test(email.trim())) errs.email = 'Looks like that\'s not a valid email.';
    if (!message.trim()) errs.message = 'Need a line or two so I know what you\'re after.';
    setFieldErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStatus({ kind: 'submitting' });

    try {
      const resp = await fetch(`${chatBaseUrl}/contact-form`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          name: name.trim() || undefined,
          message: message.trim(),
          page_url: window.location.href,
          visitor_id: window.croxAttribution?.visitorId,
          contact_ref: window.croxAttribution?.contactId,
        }),
      });

      if (!resp.ok) {
        const detail = await resp.text().catch(() => '');
        throw new Error(`status_${resp.status}_${detail.slice(0, 80)}`);
      }

      setStatus({ kind: 'success', email: email.trim() });
      // Don't clear fields in case they want to send a follow-up
      // without re-typing their address — but the form switches to a
      // success state so they aren't tempted to resubmit by accident.
    } catch (err) {
      console.warn('[crox-contact-form] submit failed:', err);
      setStatus({
        kind: 'error',
        message: "I couldn't deliver that just now. Try again in a moment, or email adam@crox.io directly.",
      });
    }
  }

  if (status.kind === 'success') {
    return (
      <div className="border border-accent p-8 bg-surface">
        <p className="font-mono text-[0.7rem] tracking-[0.2em] uppercase text-accent mb-3">Sent</p>
        <h3 className="font-serif font-normal text-[1.4rem] text-fg mb-3 leading-tight">
          Thanks — I'll be in touch.
        </h3>
        <p className="text-[0.95rem] text-fg-dim leading-[1.7]">
          I'll reach out at <span className="text-fg">{status.email}</span> within a working day
          or two. If it's urgent, the chat in the corner is the fastest way to get a feel for
          whether I'm the right person — and I read every conversation.
        </p>
      </div>
    );
  }

  const submitting = status.kind === 'submitting';

  return (
    <form onSubmit={submit} noValidate className="space-y-5">
      {heading && (
        <div>
          <h2 className="font-serif font-normal text-[1.6rem] text-fg mb-2 max-sm:text-[1.3rem]">
            {heading}
          </h2>
          {subheading && (
            <p className="text-[0.95rem] text-fg-dim leading-[1.7]">{subheading}</p>
          )}
        </div>
      )}

      <div>
        <label htmlFor="cf-email" className="block font-mono text-[0.7rem] tracking-[0.15em] uppercase text-fg-dim mb-2">
          Email
        </label>
        <input
          id="cf-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@yourcompany.com"
          className="w-full bg-bg border border-border px-4 py-3 text-[0.95rem] text-fg placeholder:text-fg-dim focus:outline-none focus:border-accent"
          aria-invalid={fieldErrors.email ? 'true' : undefined}
          aria-describedby={fieldErrors.email ? 'cf-email-err' : undefined}
        />
        {fieldErrors.email && (
          <p id="cf-email-err" className="mt-2 text-[0.8rem] text-accent">{fieldErrors.email}</p>
        )}
      </div>

      <div>
        <label htmlFor="cf-name" className="block font-mono text-[0.7rem] tracking-[0.15em] uppercase text-fg-dim mb-2">
          Name <span className="text-fg-dim normal-case">(optional)</span>
        </label>
        <input
          id="cf-name"
          type="text"
          autoComplete="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="w-full bg-bg border border-border px-4 py-3 text-[0.95rem] text-fg placeholder:text-fg-dim focus:outline-none focus:border-accent"
        />
      </div>

      <div>
        <label htmlFor="cf-message" className="block font-mono text-[0.7rem] tracking-[0.15em] uppercase text-fg-dim mb-2">
          Message
        </label>
        <textarea
          id="cf-message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={messagePlaceholder}
          className="w-full bg-bg border border-border px-4 py-3 text-[0.95rem] text-fg placeholder:text-fg-dim focus:outline-none focus:border-accent resize-y min-h-[120px]"
          aria-invalid={fieldErrors.message ? 'true' : undefined}
          aria-describedby={fieldErrors.message ? 'cf-message-err' : undefined}
        />
        {fieldErrors.message && (
          <p id="cf-message-err" className="mt-2 text-[0.8rem] text-accent">{fieldErrors.message}</p>
        )}
      </div>

      {status.kind === 'error' && (
        <p className="text-[0.9rem] text-accent">{status.message}</p>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="inline-block font-mono text-[0.8rem] font-medium tracking-[0.15em] uppercase text-fg bg-accent px-10 py-4 transition-all hover:bg-[#c4472e] hover:-translate-y-px disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
        >
          {submitting ? 'Sending…' : `${submitLabel} →`}
        </button>
      </div>
    </form>
  );
}
