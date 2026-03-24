import React from 'react';

export const DodarBenchmarkPost: React.FC = () => {
  return (
    <div className="space-y-6">
      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        Pilots don't make better decisions because they're smarter than the rest of us. They make better decisions because they have a framework. In aviation, that framework is called DODAR: Diagnose, Options, Decide, Act, Review. It's a structured reasoning loop that turns chaos into clarity. When an engine fails at 35,000 feet, you don't want someone thinking creatively. You want someone running the process.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        We wanted to know if the same principle applies to AI. Can you take a cheap, small language model, give it a structured reasoning framework, and get results that match or beat a frontier model thinking on its own? We ran the benchmark. The answer is yes.
      </p>

      <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim my-12 flex items-center gap-4">
        The experiment
        <span className="flex-1 h-px bg-border" />
      </div>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        We tested 8 large language models across 4 capability tiers — from nano-class models costing fractions of a penny per call, up to frontier models like Claude Opus 4.6 and GPT-5.4. Each model faced 10 complex decision scenarios: ambiguous business situations, trade-off problems, and cases where there's no single right answer.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        Every model was tested under 5 different prompting conditions: zero-shot (just answer the question), chain-of-thought (think step by step), single DODAR (apply the full framework in one pass), DODAR pipeline (each stage handled by a separate call), and length-matched controls (to rule out the idea that longer responses are simply better).
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        Two independent AI evaluators — Claude Opus 4.6 and GPT-5.4 — scored every response across 6 dimensions: Diagnosis Quality, Option Breadth, Decision Justification, Action Specificity, Review and Self-Correction, and Overall Trustworthiness. Inter-rater reliability was strong: 70.5% exact agreement, 99.7% agreement within 1 point, with a mean absolute deviation of 0.30.
      </p>

      <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim my-12 flex items-center gap-4">
        The headline result
        <span className="flex-1 h-px bg-border" />
      </div>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        GPT-4.1 Mini — a model that costs roughly 89% less than Claude Opus per call — scored 4.80 out of 5.0 when running the DODAR pipeline. Opus, thinking on its own with zero-shot prompting, scored 4.62. That's a small, cheap model outperforming one of the most capable models available. Not by a rounding error. By a statistically significant margin, with a Cohen's d of 2.78.
      </p>

      <blockquote className="border-l-2 border-accent pl-6 my-8 text-fg italic font-serif text-[1.1rem]">
        Structure beats capability. A small model with a good framework outperformed a frontier model without one.
      </blockquote>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        It wasn't just Mini. Haiku 4.5 — Anthropic's smallest and cheapest model — hit 4.70 with the pipeline, outperforming Opus zero-shot by nearly 2%. Even GPT-4.1 Nano, the cheapest model we tested, reached 4.55 — 98.5% of Opus zero-shot quality. The pattern was consistent across every model we tested: add structure, get better results.
      </p>

      <h2 className="font-serif font-normal text-[1.6rem] mb-4 mt-8">
        Three findings that matter
      </h2>

      <h3 className="font-serif font-normal text-[1.2rem] mb-3 mt-6 text-fg">
        1. Structure beats raw capability
      </h3>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        This is the core finding. Across every tier, the DODAR pipeline lifted model performance dramatically. The effect was largest for smaller models — they had the most room to improve — but it was present everywhere. Pipeline variance was approximately 46% lower than other conditions, meaning the results weren't just better on average, they were more consistent.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        The implication is significant. If you're building AI systems and your instinct is to reach for the biggest, most expensive model, you might be solving the wrong problem. The bottleneck isn't model intelligence. It's reasoning structure.
      </p>

      <h3 className="font-serif font-normal text-[1.2rem] mb-3 mt-6 text-fg">
        2. The chain-of-thought paradox
      </h3>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        Chain-of-thought prompting — "think step by step" — is widely considered best practice. In our benchmark, it underperformed zero-shot for 6 out of 8 models. Simply asking a model to think more didn't help. In several cases, it made things worse. The model would generate confident-sounding reasoning that led to worse conclusions.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        The DODAR pipeline, by contrast, improved every model. The difference is that chain-of-thought gives a model permission to think longer. DODAR tells it exactly how to think — what to consider at each stage, what to produce, how to sequence the reasoning. The structure isn't optional decoration. It's the mechanism that produces the result.
      </p>

      <h3 className="font-serif font-normal text-[1.2rem] mb-3 mt-6 text-fg">
        3. Monolithic vs pipeline: a critical distinction
      </h3>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        One of the most striking results was what happened to GPT-5.4 — a frontier model — when given DODAR as a single monolithic prompt. Its score collapsed to 1.85 out of 5.0, a 59% degradation from its zero-shot baseline. The model couldn't handle the full framework in a single pass. It got confused, produced garbled outputs, and lost coherence.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        When the same model ran DODAR as a pipeline — each stage as a separate API call, with the output of one stage feeding into the next — it recovered to 4.39. The lesson: even frontier models benefit from decomposition. Don't ask a model to do everything at once. Break the reasoning into stages.
      </p>

      <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim my-12 flex items-center gap-4">
        The cost case
        <span className="flex-1 h-px bg-border" />
      </div>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        The economics are compelling. If you're building a system that needs high-quality decision support — customer service escalation, risk assessment, compliance review — you might assume you need a frontier model. Our benchmark suggests otherwise.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        A GPT-4.1 Mini pipeline delivers 104% of the quality of Opus zero-shot at roughly 11% of the cost. Yes, the pipeline uses multiple API calls per decision, so the per-decision cost is higher than a single Mini call. But it's still dramatically cheaper than a single Opus call. And the quality is better.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        For production systems processing thousands of decisions, the savings compound fast. You get better quality, more consistent outputs, and lower costs. That's the rare case where you don't have to trade off between quality and price.
      </p>

      <h2 className="font-serif font-normal text-[1.6rem] mb-4 mt-8">
        What this means if you're building
      </h2>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        If you're integrating AI into business workflows, the benchmark points to a specific strategy. Don't default to the most expensive model. Instead, invest in the reasoning architecture — the scaffolding around the model — and use smaller, cheaper models to execute each stage.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        This is what we do at Crox. We build structured AI pipelines that connect to your business tools via Model Context Protocol. The DODAR framework is one example of the kind of reasoning architecture that turns AI from a clever autocomplete into a reliable decision-support system.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        The pipeline approach also makes systems more predictable. When a model fails in a pipeline, you can identify exactly which stage broke. You can swap out one model for another at a specific stage. You can add validation between stages. This is software engineering, not prompt magic.
      </p>

      <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim my-12 flex items-center gap-4">
        Honest limitations
        <span className="flex-1 h-px bg-border" />
      </div>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        We want to be transparent about what the benchmark does and doesn't show. The sample size is 10 independent scenarios, each scored by 2 evaluators. That's enough to show strong statistical effects — Cohen's d of 2.78 is a very large effect size — but it's not thousands of trials. We're presenting this as strong early evidence, not settled science.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        There are ceiling effects. 29.2% of pipeline scores hit 4.9 or above out of 5.0. This means the pipeline is so effective that our scoring scale may not be capturing the full range of quality differences at the top end. A longer benchmark with a wider scale might reveal more differentiation.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        The pipeline adds latency. Running 5 separate API calls takes longer than running 1. For real-time applications where response speed matters, there's a trade-off to consider. For batch processing, back-office operations, and asynchronous workflows, it's not an issue.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        Finally, we tested bounded decision tasks — the kind of structured reasoning that DODAR was designed for. We haven't tested creative tasks, code generation, or open-ended conversation. The framework may not generalise to those domains.
      </p>

      <h2 className="font-serif font-normal text-[1.6rem] mb-4 mt-8">
        Try it yourself
      </h2>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        We've built an interactive showcase at{' '}
        <a href="https://dodar.crox.io" target="_blank" rel="noopener noreferrer" className="text-fg border-b border-border pb-px hover:border-accent transition-colors">
          dodar.crox.io
        </a>
        {' '}where you can see the DODAR framework in action, explore the benchmark results, and test it against your own scenarios.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        If you're interested in how structured reasoning pipelines could improve your AI systems — whether that's decision support, compliance review, or customer operations —{' '}
        <a href="https://calendar.app.google/3avUXyXnctfWpyHF7" target="_blank" rel="noopener noreferrer" className="text-fg border-b border-border pb-px hover:border-accent transition-colors">
          book a call
        </a>
        {' '}and we'll walk you through the research and what it means for your specific use case.
      </p>

      <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim my-12 flex items-center gap-4">
        About this research
        <span className="flex-1 h-px bg-border" />
      </div>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        This research was conducted by Adam Field at{' '}
        <a href="/" className="text-fg border-b border-border pb-px hover:border-accent transition-colors">
          Crox
        </a>
        . The DODAR framework was adapted from aviation decision-making methodology and applied to LLM reasoning benchmarking. All benchmark costs reflect actual API pricing at the time of testing. The full methodology, scoring rubrics, and raw results are available in the{' '}
        <a href="https://dodar.crox.io" target="_blank" rel="noopener noreferrer" className="text-fg border-b border-border pb-px hover:border-accent transition-colors">
          research whitepaper
        </a>
        .
      </p>
    </div>
  );
};
