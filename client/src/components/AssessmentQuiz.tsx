import { useMemo, useState } from 'react';
import {
  ASSESSMENT_QUESTIONS,
  BANDS,
  MAX_SCORE,
  calculateScore,
  scoreToBand,
} from '../lib/assessment';

type Step = 'questions' | 'result' | 'submitting' | 'done' | 'error';

interface SubmitPayload {
  name: string;
  email: string;
  company: string;
  answers: Record<string, number>;
  score: number;
  band: string;
  // Honeypot — must stay empty.
  website: string;
}

export default function AssessmentQuiz() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [questionIdx, setQuestionIdx] = useState(0);
  const [step, setStep] = useState<Step>('questions');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [website, setWebsite] = useState('');
  const [error, setError] = useState<string | null>(null);

  const score = useMemo(() => calculateScore(answers), [answers]);
  const band = useMemo(() => scoreToBand(score), [score]);

  const current = ASSESSMENT_QUESTIONS[questionIdx];
  const total = ASSESSMENT_QUESTIONS.length;
  const allAnswered = ASSESSMENT_QUESTIONS.every((q) => typeof answers[q.id] === 'number');

  function selectAnswer(qid: string, optionIdx: number) {
    const next = { ...answers, [qid]: optionIdx };
    setAnswers(next);
    if (questionIdx < total - 1) {
      setTimeout(() => setQuestionIdx(questionIdx + 1), 180);
    } else {
      setTimeout(() => setStep('result'), 180);
    }
  }

  function goBack() {
    if (step === 'result') {
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

    const payload: SubmitPayload = {
      name: trimmedName,
      email: trimmedEmail,
      company: company.trim(),
      answers,
      score,
      band: band.name,
      website,
    };

    setStep('submitting');
    try {
      const res = await fetch('/api/assessment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || `Submit failed (${res.status})`);
      }
      setStep('done');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please email adam@crox.io.');
      setStep('error');
    }
  }

  // --- Done state --------------------------------------------------------
  if (step === 'done') {
    return (
      <div className="border-l-2 border-accent pl-6 py-2">
        <p className="font-mono text-[0.7rem] tracking-[0.2em] uppercase text-accent mb-4">Submitted</p>
        <h2 className="font-serif font-normal text-[1.8rem] leading-[1.2] mb-4 max-sm:text-[1.4rem]">
          Thanks, {name.split(' ')[0]}.
        </h2>
        <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
          Your score is <span className="text-fg">{score} / {MAX_SCORE}</span> — {band.headline.toLowerCase().replace(/\.$/, '')}. Adam will read your answers and reply within two working days from <span className="text-fg">adam@crox.io</span>.
        </p>
      </div>
    );
  }

  // --- Result + email gate ------------------------------------------------
  if (step === 'result' || step === 'submitting' || step === 'error') {
    return (
      <div>
        <ScoreSummary score={score} bandName={band.name} headline={band.headline} description={band.description} recommendation={band.recommendation} />

        <div className="mt-12 pt-10 border-t border-border">
          <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim mb-8 flex items-center gap-4">
            See the detail
            <span className="flex-1 h-px bg-border"></span>
          </div>

          <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-8">
            Leave your details and Adam will reply within two working days with a short read on
            what your answers actually point to — including the one or two things that would
            move your score most. No newsletter sign-up. No call gauntlet.
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
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              autoComplete="email"
              required
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
                {step === 'submitting' ? 'Sending…' : 'Send my answers →'}
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
            onClick={() => setStep('result')}
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
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  required?: boolean;
  autoComplete?: string;
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
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-surface border border-border focus:border-accent text-fg px-4 py-3 text-[0.95rem] outline-none transition-colors"
      />
    </div>
  );
}
