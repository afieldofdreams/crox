// AI Readiness Scorecard quiz — five questions, scored 0–15, banded.
//
// On submit POSTs to chat.crox.io/assessment which:
//   - recomputes the score server-side (never trusts the client)
//   - upserts the visitor as a CRM/Contact via flight-deck /api/forms
//   - appends an "Assessment capture" entry to the Activity Stream
//   - emails Adam via Resend
//   - fires PostHog assessment_completed
//
// Identity: reads window.croxAttribution from flight-deck's track.js
// so the assessment lead joins up with the visitor's prior pageviews
// in PostHog and any earlier engagement in flight-deck.

import { useMemo, useRef, useState } from 'react';
import {
  ASSESSMENT_QUESTIONS,
  BANDS,
  BOOKING_URL,
  MAX_SCORE,
  calculateScore,
  scoreToBand,
} from '../lib/assessment';

type Step = 'questions' | 'gate' | 'submitting' | 'done' | 'error';

interface CroxAttribution {
  visitorId?: string;
  contactId?: string;
}

interface PostHogLike {
  capture: (event: string, props?: Record<string, unknown>) => void;
  identify: (id: string, props?: Record<string, unknown>) => void;
}

declare global {
  interface Window {
    croxAttribution?: CroxAttribution;
  }
}

function ph(): PostHogLike | null {
  if (typeof window === 'undefined') return null;
  return (window as unknown as { posthog?: PostHogLike }).posthog ?? null;
}

const DEFAULT_CHAT_BASE_URL = 'https://chat.crox.io';

interface Props {
  chatBaseUrl?: string;
}

export default function AssessmentQuiz({ chatBaseUrl = DEFAULT_CHAT_BASE_URL }: Props) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [questionIdx, setQuestionIdx] = useState(0);
  const [step, setStep] = useState<Step>('questions');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [website, setWebsite] = useState('');
  const [error, setError] = useState<string | null>(null);
  const startedTracked = useRef(false);

  const score = useMemo(() => calculateScore(answers), [answers]);
  const band = useMemo(() => scoreToBand(score), [score]);

  const current = ASSESSMENT_QUESTIONS[questionIdx];
  const total = ASSESSMENT_QUESTIONS.length;
  const allAnswered = ASSESSMENT_QUESTIONS.every((q) => typeof answers[q.id] === 'number');

  function selectAnswer(qid: string, optionIdx: number) {
    if (!startedTracked.current) {
      startedTracked.current = true;
      ph()?.capture('assessment_started');
    }
    const next = { ...answers, [qid]: optionIdx };
    setAnswers(next);
    if (questionIdx < total - 1) {
      setTimeout(() => setQuestionIdx(questionIdx + 1), 180);
    } else {
      setTimeout(() => setStep('gate'), 180);
    }
  }

  function goBack() {
    if (step === 'gate' || step === 'error') {
      setStep('questions');
      return;
    }
    if (questionIdx > 0) setQuestionIdx(questionIdx - 1);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    if (!trimmedName) {
      setError('Please add your name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError('Please enter a valid email address.');
      return;
    }

    setStep('submitting');
    try {
      const res = await fetch(`${chatBaseUrl}/assessment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: trimmedName,
          email: trimmedEmail,
          company: company.trim() || undefined,
          answers,
          page_url: window.location.href,
          visitor_id: window.croxAttribution?.visitorId,
          contact_ref: window.croxAttribution?.contactId,
          website,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.detail || body.error || `Submit failed (${res.status})`);
      }
      const data = await res.json().catch(() => ({})) as {
        ok?: boolean;
        score?: number;
        band?: string;
      };

      const posthog = ph();
      if (posthog) {
        posthog.identify(trimmedEmail, {
          name: trimmedName,
          company: company.trim() || undefined,
          email: trimmedEmail,
        });
        posthog.capture('assessment_completed', {
          score: data.score ?? score,
          max_score: MAX_SCORE,
          band: data.band ?? band.name,
          has_company: Boolean(company.trim()),
        });
      }
      setStep('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please email adam@crox.io.');
      setStep('error');
    }
  }

  // --- Done state: reveal score, band, recommendation, next steps -------
  if (step === 'done') {
    return (
      <div>
        <p className="font-mono text-[0.7rem] tracking-[0.2em] uppercase text-accent mb-4">
          Thanks, {name.split(' ')[0]}.
        </p>
        <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-12">
          Adam will read your answers and reply within two working days from{' '}
          <span className="text-fg">adam@crox.io</span>. In the meantime, here's the read.
        </p>

        <ScoreSummary
          score={score}
          bandName={band.name}
          headline={band.headline}
          description={band.description}
          recommendation={band.recommendation}
        />

        {/* Recommended service + book-a-call CTA */}
        <div className="mt-12 pt-10 border-t border-border">
          <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim mb-8 flex items-center gap-4">
            What to do next
            <span className="flex-1 h-px bg-border"></span>
          </div>

          <a
            href={band.service.href}
            className="group block border border-border p-6 mb-8 no-underline transition-all hover:border-accent hover:bg-surface/40"
          >
            <p className="font-mono text-[0.7rem] tracking-[0.2em] uppercase text-accent mb-3">
              Recommended service
            </p>
            <h3 className="font-serif font-normal text-[1.5rem] leading-[1.2] mb-3 text-fg group-hover:text-accent transition-colors max-sm:text-[1.25rem]">
              {band.service.name}
            </h3>
            <p className="text-[0.95rem] text-fg-dim leading-[1.7] mb-4">
              {band.service.blurb}
            </p>
            <span className="inline-flex items-center font-mono text-[0.8rem] font-medium tracking-[0.1em] uppercase text-accent">
              See how we can help
              <span className="ml-2 transition-transform group-hover:translate-x-1">&rarr;</span>
            </span>
          </a>

          <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-8">
            Best way to figure out if this is the right fit is a 30-minute call.
            No pitch, no obligation — we go through your answers, work out whether
            Adam can actually help, and what shape that would take.
          </p>

          <div className="flex flex-wrap items-center gap-6">
            <a
              href={BOOKING_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-mono text-[0.8rem] font-medium tracking-[0.15em] uppercase text-fg bg-accent px-10 py-4 transition-all hover:bg-[#c4472e] hover:-translate-y-px no-underline"
            >
              Book 30 minutes with Adam &rarr;
            </a>
          </div>
        </div>
      </div>
    );
  }

  // --- Gate: collect name + work email before revealing the score -------
  if (step === 'gate' || step === 'submitting' || step === 'error') {
    return (
      <div>
        <p className="font-mono text-[0.7rem] tracking-[0.2em] uppercase text-accent mb-6">
          Almost there
        </p>
        <h2 className="font-serif font-normal text-[2rem] leading-[1.2] mb-6 max-sm:text-[1.5rem]">
          Where should we send your result?
        </h2>
        <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-10">
          Leave your name and work email to see your score, band, and the one or two things that
          would move it most. Adam reads every submission and replies within two working days.
          No newsletter sign-up. No call gauntlet.
        </p>

        <form onSubmit={submit} noValidate className="space-y-5">
          <Field
            id="aq-name"
            label="Name"
            value={name}
            onChange={setName}
            autoComplete="name"
            required
          />
          <Field
            id="aq-email"
            label="Work email"
            type="email"
            value={email}
            onChange={setEmail}
            autoComplete="email"
            required
            placeholder="you@yourcompany.com"
          />
          <Field
            id="aq-company"
            label="Company (optional)"
            value={company}
            onChange={setCompany}
            autoComplete="organization"
          />

          {/* Honeypot — hidden from humans */}
          <div className="absolute -left-[10000px] w-px h-px overflow-hidden" aria-hidden="true">
            <label htmlFor="aq-website">Website</label>
            <input
              id="aq-website"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          {error && (
            <p role="alert" className="text-[0.85rem] text-accent">{error}</p>
          )}

          <div className="flex flex-wrap items-center gap-6 pt-2">
            <button
              type="submit"
              disabled={step === 'submitting'}
              className="font-mono text-[0.8rem] font-medium tracking-[0.15em] uppercase text-fg bg-accent px-10 py-4 transition-all hover:bg-[#c4472e] hover:-translate-y-px disabled:opacity-60 disabled:hover:translate-y-0 cursor-pointer border-0"
            >
              {step === 'submitting' ? 'Sending…' : 'See my result →'}
            </button>
            <button
              type="button"
              onClick={goBack}
              className="text-[0.85rem] text-fg-dim hover:text-fg transition-colors bg-transparent border-0 cursor-pointer"
            >
              &larr; Change my answers
            </button>
          </div>
        </form>
      </div>
    );
  }

  // --- Question state ----------------------------------------------------
  const progressPct = Math.round(((questionIdx) / total) * 100);

  return (
    <div>
      <div className="flex items-center gap-4 mb-10 font-mono text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim">
        <span className="text-accent">{current.pillar}</span>
        <span className="flex-1 h-px bg-border" />
        <span>Question {questionIdx + 1} of {total}</span>
      </div>

      <div aria-hidden="true" className="h-px bg-border mb-10 overflow-hidden">
        <div
          className="h-px bg-accent transition-all"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <h2 className="font-serif font-normal text-[1.7rem] leading-[1.3] mb-10 max-sm:text-[1.3rem]">
        {current.prompt}
      </h2>

      <ul className="space-y-3" role="radiogroup" aria-label={current.prompt}>
        {current.options.map((opt, i) => {
          const isSelected = answers[current.id] === i;
          return (
            <li key={i}>
              <button
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => selectAnswer(current.id, i)}
                className={[
                  'w-full text-left flex items-start gap-4 p-5 border bg-surface transition-colors cursor-pointer',
                  isSelected ? 'border-accent text-fg' : 'border-border text-fg-dim hover:border-accent hover:text-fg',
                ].join(' ')}
              >
                <span
                  aria-hidden="true"
                  className={[
                    'font-mono text-[0.7rem] tracking-[0.1em] uppercase mt-[0.2rem] shrink-0',
                    isSelected ? 'text-accent' : 'text-fg-dim',
                  ].join(' ')}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-[0.95rem] leading-[1.6]">{opt.label}</span>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="flex flex-wrap items-center gap-6 mt-10">
        <button
          type="button"
          onClick={goBack}
          disabled={questionIdx === 0}
          className="text-[0.85rem] text-fg-dim hover:text-fg transition-colors bg-transparent border-0 cursor-pointer disabled:opacity-30 disabled:hover:text-fg-dim disabled:cursor-not-allowed"
        >
          &larr; Back
        </button>
        {allAnswered && questionIdx === total - 1 && (
          <button
            type="button"
            onClick={() => setStep('gate')}
            className="font-mono text-[0.8rem] font-medium tracking-[0.15em] uppercase text-fg bg-accent px-8 py-3 transition-all hover:bg-[#c4472e] hover:-translate-y-px cursor-pointer border-0"
          >
            See my score &rarr;
          </button>
        )}
      </div>
    </div>
  );
}

function ScoreSummary({
  score,
  bandName,
  headline,
  description,
  recommendation,
}: {
  score: number;
  bandName: string;
  headline: string;
  description: string;
  recommendation: string;
}) {
  return (
    <div>
      <p className="font-mono text-[0.7rem] tracking-[0.2em] uppercase text-accent mb-6">Your score</p>

      <div className="flex items-baseline gap-4 mb-8">
        <span className="font-serif text-[5rem] leading-none text-fg max-sm:text-[3.5rem]">{score}</span>
        <span className="font-mono text-[1rem] text-fg-dim">/ {MAX_SCORE}</span>
        <span className="ml-auto font-mono text-[0.75rem] tracking-[0.15em] uppercase text-fg-dim">
          Band: <span className="text-accent">{bandName}</span>
        </span>
      </div>

      <h2 className="font-serif font-normal text-[2rem] leading-[1.2] mb-6 max-sm:text-[1.5rem]">
        {headline}
      </h2>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">{description}</p>

      <div className="border-l-2 border-accent pl-6 py-1">
        <p className="font-mono text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim mb-2">Suggested next step</p>
        <p className="text-[0.95rem] text-fg leading-[1.7]">{recommendation}</p>
      </div>

      <div className="mt-10 grid grid-cols-3 gap-2 max-sm:grid-cols-1">
        {BANDS.map((b) => (
          <div
            key={b.name}
            className={[
              'p-4 border text-center',
              b.name === bandName ? 'border-accent bg-surface' : 'border-border',
            ].join(' ')}
          >
            <p className="font-mono text-[0.65rem] tracking-[0.15em] uppercase text-fg-dim mb-1">
              {b.range[0]}–{b.range[1]}
            </p>
            <p className={['text-[0.85rem]', b.name === bandName ? 'text-fg' : 'text-fg-dim'].join(' ')}>
              {b.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Field({
  id,
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  autoComplete,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  autoComplete?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label htmlFor={id} className="block font-mono text-[0.7rem] tracking-[0.15em] uppercase text-fg-dim mb-2">
        {label}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-surface border border-border focus:border-accent text-fg px-4 py-3 text-[0.95rem] placeholder:text-fg-dim outline-none transition-colors"
      />
    </div>
  );
}
