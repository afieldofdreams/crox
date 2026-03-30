import React from 'react';

export const DodarBenchmarkFailurePost: React.FC = () => {
  return (
    <div className="space-y-6">
      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        We ran 1,500 benchmark tests to find out whether DODAR-based prompting improves LLM reasoning. It doesn't improve accuracy. But it measurably changes how models fail — and that finding is statistically significant (p = 0.0003).
      </p>

      <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim my-12 flex items-center gap-4">
        What we tested
        <span className="flex-1 h-px bg-border" />
      </div>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        Phase-Gated Reasoning (PGR) encodes DODAR's five phases — Diagnose, Options, Decide, Action, Review — directly into an LLM system prompt. We tested two PGR variants against three controls on GPT-4.1-mini across 100 benchmark tasks, each run three times:
      </p>

      <ul className="space-y-2 text-[0.95rem] text-fg-dim leading-[1.8] list-none pl-0">
        <li><strong className="text-fg">A — Baseline:</strong> No system prompt</li>
        <li><strong className="text-fg">B — Zero-Shot CoT:</strong> "Think step by step" (token-matched to C)</li>
        <li><strong className="text-fg">C — PGR (Late Commitment):</strong> Five phases, decision deferred to REVIEW</li>
        <li><strong className="text-fg">C_prev — PGR (Early Commitment):</strong> Five phases, decision at DECIDE (original design)</li>
        <li><strong className="text-fg">G — Few-Shot CoT:</strong> Three worked examples showing step-by-step reasoning</li>
      </ul>

      <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim my-12 flex items-center gap-4">
        What we found
        <span className="flex-1 h-px bg-border" />
      </div>

      <h2 className="font-serif font-normal text-[1.6rem] mb-4 mt-8">
        Accuracy is flat
      </h2>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        A: 88.7% | B: 85.7% | C: 88.3% | C_prev: 87.3% | G: 91.0%
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        All conditions fall within a 5.3 percentage point range. No PGR comparison reaches statistical significance. The model either knows the answer or it doesn't — how you ask it to think about it doesn't change that.
      </p>

      <h2 className="font-serif font-normal text-[1.6rem] mb-4 mt-8">
        Error distributions are significantly different
      </h2>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        This is the real finding. When PGR fails, 39% of its errors are anchoring and failure-to-revise — nearly double the baseline rate of 21%. The structured phases create commitment points that become cognitive traps. The model commits to an answer, generates evidence against it, and then stands pat.
      </p>

      <div className="overflow-x-auto my-8">
        <table className="w-full text-[0.9rem] text-fg-dim">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 pr-6 text-fg font-normal">Error Type</th>
              <th className="text-left py-3 px-6 text-fg font-normal">Baseline</th>
              <th className="text-left py-3 px-6 text-fg font-normal">PGR (Late)</th>
              <th className="text-left py-3 pl-6 text-fg font-normal">Few-Shot CoT</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6">Anchoring + Failure to Revise</td>
              <td className="py-3 px-6">21%</td>
              <td className="py-3 px-6">39%</td>
              <td className="py-3 pl-6">24%</td>
            </tr>
            <tr className="border-b border-border/50">
              <td className="py-3 pr-6">Comprehension Failure</td>
              <td className="py-3 px-6">33%</td>
              <td className="py-3 px-6">21%</td>
              <td className="py-3 pl-6">50%</td>
            </tr>
            <tr>
              <td className="py-3 pr-6">Execution Error</td>
              <td className="py-3 px-6">41%</td>
              <td className="py-3 px-6">36%</td>
              <td className="py-3 pl-6">19%</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="font-serif font-normal text-[1.6rem] mb-4 mt-8">
        Few-Shot CoT wins
      </h2>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        The only significant accuracy result: Few-Shot CoT (91%) significantly outperforms Zero-Shot CoT (85.7%) on Wilcoxon signed-rank (p = 0.033). Showing beats telling. Models are better at imitating demonstrated reasoning than following abstract process descriptions.
      </p>

      <h2 className="font-serif font-normal text-[1.6rem] mb-4 mt-8">
        Self-review doesn't work in LLMs
      </h2>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        DODAR's REVIEW phase works in a cockpit because the first officer is a different human challenging the captain. In an LLM, REVIEW is the same model reviewing its own output. We tested an anti-anchoring variant that explicitly instructed the model to argue against its own answer. It made things worse — the model performed the review ritual perfectly and changed nothing.
      </p>

      <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim my-12 flex items-center gap-4">
        The exception
        <span className="flex-1 h-px bg-border" />
      </div>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        One task (BBH-CJ-005) shows late-commitment PGR working exactly as designed. It's a causal judgement question where every other condition goes 0/3 and PGR goes 3/3. By deferring commitment to REVIEW and testing both causal framings equally, the model avoids a trap that every other condition falls into. But this is the exception, not the rule.
      </p>

      <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim my-12 flex items-center gap-4">
        What this means for DODAR
        <span className="flex-1 h-px bg-border" />
      </div>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        DODAR remains a powerful framework for human decision-making. The REVIEW phase works because it involves an independent perspective — a different person challenging the decision-maker's assumptions.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        The insight from this study is that DODAR may be better suited as an architecture pattern than a prompting pattern for AI systems. Instead of one model following all five phases, route DIAGNOSE through DECIDE to one model, then hand the reasoning trace to a separate model (or fresh context) for REVIEW. Give the reviewer genuine independence — no memory of the reasoning that produced the anchor.
      </p>

      <blockquote className="border-l-2 border-accent pl-6 my-8 text-fg italic font-serif text-[1.1rem]">
        Multi-agent DODAR — where the reviewer has no memory of the original reasoning — is the natural next step.
      </blockquote>

      <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim my-12 flex items-center gap-4">
        Protocol deviations
        <span className="flex-1 h-px bg-border" />
      </div>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        This study evolved during execution. The original protocol specified seven prompting conditions, seven models across three stages, and human error classification. What was actually executed: five conditions, one model, LLM-only classification.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        The PGR prompt was redesigned mid-study from early commitment (decision at DECIDE) to late commitment (decision at REVIEW) after failure analysis showed the model consistently found errors in REVIEW but refused to change its answer. The original prompt was retained as a comparison condition.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        Conditions D (ReAct), E (Step-Back), and F (Shuffled PGR) were tested in preliminary runs but dropped from the final triplicate. Multi-model stages 2 and 3 were not executed — accuracy was flat, so cross-model validation was not pursued.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        Human error classification was not performed. The blinding script (blind_responses.py) was written but never run. LLM raters (Claude Opus 4.6 + GPT-5.4) classified all errors, with inter-rater kappa of 0.456 — below the protocol's 0.7 threshold for accepting LLM labels as primary data. The chi-squared result (p = 0.0003) is robust enough to survive noisy labels, but specific error counts are directional rather than precise.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        The full protocol deviations table is in the{' '}
        <a href="/dodar-benchmark-report.pdf" className="text-fg border-b border-border pb-px hover:border-accent transition-colors">
          benchmark report PDF
        </a>
        .
      </p>

      <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim my-12 flex items-center gap-4">
        Full report
        <span className="flex-1 h-px bg-border" />
      </div>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        The complete methodology, data, and analysis are available in the{' '}
        <a href="/dodar-benchmark-report.pdf" className="text-fg border-b border-border pb-px hover:border-accent transition-colors">
          benchmark report PDF
        </a>
        . Contact{' '}
        <a href="mailto:adam@crox.io" className="text-fg border-b border-border pb-px hover:border-accent transition-colors">
          adam@crox.io
        </a>
        {' '}for the raw data and code.
      </p>

      <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim my-12 flex items-center gap-4">
        About this research
        <span className="flex-1 h-px bg-border" />
      </div>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        Study conducted March 2026 by Adam Field /{' '}
        <a href="/" className="text-fg border-b border-border pb-px hover:border-accent transition-colors">
          Crox
        </a>
        . 1,500 runs on GPT-4.1-mini. Error classification by Claude Opus 4.6 and GPT-5.4. Total API cost: $1.45.
      </p>
    </div>
  );
};
