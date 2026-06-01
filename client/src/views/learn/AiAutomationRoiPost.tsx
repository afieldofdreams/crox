import React from "react";

const AiAutomationRoiPost: React.FC = () => {
  return (
    <article className="prose prose-invert max-w-none">
      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        Every AI initiative eventually reaches the same room: the one where someone with budget authority asks, "What do we actually get back for this?" It's a fair question, and a surprising number of AI projects can't answer it cleanly. They were justified on excitement, not arithmetic, and when the renewal comes up nobody can say whether it paid off. This article is about answering that question properly—before you start, so you can prove it afterward.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        The good news is that AI automation ROI is more measurable than most software investments, precisely because it usually replaces a task you can count. The trap is reaching for a single dramatic number when the real return is a mix of hard savings, soft gains, and avoided cost. Let's separate them.
      </p>

      {/* Section Divider */}
      <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim my-12 flex items-center gap-4">
        The Three Kinds of Return
        <span className="flex-1 h-px bg-border" />
      </div>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        <span className="text-fg">Hard savings</span> are the ones a CFO trusts: hours of labour removed, error-correction costs avoided, software licences consolidated. They're directly attributable and defensible. If a task took 200 hours a month and now takes 40, you've reclaimed 160 hours you can value at a real loaded rate.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        <span className="text-fg">Soft gains</span> are real but harder to attribute: faster turnaround, happier staff doing less drudgery, fewer things falling through the cracks, capacity to take on more work without hiring. These matter—often more than the hard savings—but they're easy to over-claim, so quote them carefully and separately.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        <span className="text-fg">Avoided cost</span> is the return nobody sees because it never happens: the compliance breach you didn't have, the customer who didn't churn because the reply came in an hour instead of two days, the headcount you didn't need to add to handle growth. Avoided cost is the most undervalued category and the hardest to put on a slide.
      </p>

      <div className="bg-surface border border-border p-6 my-8">
        <p className="text-fg font-serif text-[1.1rem] mb-3">A Defensible ROI Statement</p>
        <div className="font-mono text-[0.8rem] text-fg-dim leading-[1.8]">
          <div>Hard savings (proven) + Soft gains (estimated, conservative) − Total cost of ownership</div>
          <div className="mt-3 text-fg-dim text-[0.9rem]">Lead with the hard number. Quote soft gains as a range, not a point. Always subtract the full cost, not just the licence.</div>
        </div>
      </div>

      {/* Section Divider */}
      <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim my-12 flex items-center gap-4">
        Baseline Before You Build
        <span className="flex-1 h-px bg-border" />
      </div>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        The single most common reason an AI project can't prove its ROI is that nobody measured the "before." You cannot demonstrate that you saved 160 hours a month if you never knew the task took 200 in the first place. The baseline is the most valuable hour of work in the entire project, and it's almost always skipped.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        Before you automate anything, capture a few honest numbers: how long the task currently takes, how often it's done, who does it and at what cost, the current error or rework rate, and the current turnaround time. You don't need a six-week time-and-motion study. A representative two-week sample, agreed as fair by the people doing the work, is enough to anchor every claim you'll make later.
      </p>

      <blockquote className="border-l-2 border-accent pl-6 my-8 text-fg italic font-serif text-[1.1rem]">
        ROI isn't a number you calculate at the end. It's a measurement you set up at the beginning and read off later.
      </blockquote>

      {/* Section Divider */}
      <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim my-12 flex items-center gap-4">
        A Simple Payback Framework
        <span className="flex-1 h-px bg-border" />
      </div>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        You don't need a finance degree to model the payback on an automation. The basic structure is:
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        <span className="text-fg">Monthly benefit</span> = hours reclaimed × loaded hourly cost, plus any error or rework cost removed. <span className="text-fg">Total cost of ownership</span> = build cost (one-off) plus running cost (software, AI usage, and the maintenance the thing genuinely needs). <span className="text-fg">Payback period</span> = build cost ÷ (monthly benefit − monthly running cost).
      </p>

      <div className="bg-surface border border-border p-6 my-8">
        <p className="text-fg font-serif text-[1.1rem] mb-3">Worked Example</p>
        <div className="font-mono text-[0.8rem] text-fg-dim leading-[1.8]">
          <div>Reclaimed: 160 hrs/mo × £35 loaded = £5,600/mo benefit</div>
          <div>Running cost: £600/mo (software + AI usage + upkeep)</div>
          <div>Net monthly benefit: £5,000</div>
          <div>Build cost: £20,000 one-off</div>
          <div className="mt-3 text-accent">Payback: £20,000 ÷ £5,000 = 4 months</div>
        </div>
      </div>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        A payback period under six to nine months is generally an easy yes. Beyond eighteen months, the case needs to lean on soft gains or avoided cost to stand up—which is fine, as long as you're explicit that it does. The discipline of writing the numbers down, even rough ones, is what separates a fundable proposal from a hopeful one.
      </p>

      {/* Section Divider */}
      <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim my-12 flex items-center gap-4">
        The ROI Traps to Watch
        <span className="flex-1 h-px bg-border" />
      </div>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        <span className="text-fg">Counting hours you can't actually recover.</span> Saving each of forty people six minutes a day is four hours a day on paper—but if it's spread too thin to redeploy, it's comfort, not capacity. Be honest about whether reclaimed time becomes real output, fewer hires, or simply a lighter day. All three are valid; only some show up in the accounts.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        <span className="text-fg">Forgetting the cost of ownership.</span> The licence is rarely the real cost. Per-use AI charges, the integration that connects the AI to your data, monitoring, and the person who keeps an eye on quality are all part of the bill. A return that looks great on the subscription price alone can evaporate once the full picture is in.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        <span className="text-fg">Ignoring the ramp.</span> Automations rarely hit full performance on day one. There's a tuning period where a human still checks most of the output. Model the return on the steady state, but budget for the ramp—and don't judge the project by week one.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        <span className="text-fg">Claiming the soft gains as hard cash.</span> "Improved morale" and "better customer experience" are genuine and worth stating—but the moment you convert them into a precise pound figure and add them to your headline savings, a sceptical CFO stops believing the whole number. Keep the categories separate and your credibility intact.
      </p>

      {/* Section Divider */}
      <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim my-12 flex items-center gap-4">
        Measuring It Afterward
        <span className="flex-1 h-px bg-border" />
      </div>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        Once the automation is live, the same baseline metrics become your scorecard. Re-measure time, volume, error rate, and turnaround on the same basis you captured them before. Report the change honestly, including where the AI fell short or needed more oversight than expected. A truthful "we reclaimed 70% of the projected hours and here's why the other 30% stayed manual" builds far more trust—and far more appetite for the next project—than an inflated victory lap.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        Getting this right is as much about measurement discipline as it is about the technology, and it's where we focus early with clients. At Crox we help you baseline the process, model a defensible payback before any build begins, and report the real result afterward—so the question "what did we get back for this?" always has an answer you can stand behind.
      </p>
    </article>
  );
};

export default AiAutomationRoiPost;
