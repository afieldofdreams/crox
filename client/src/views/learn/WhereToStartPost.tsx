import React from "react";

const WhereToStartPost: React.FC = () => {
  return (
    <article className="prose prose-invert max-w-none">
      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        Someone on the board has decided the business needs to "do something with AI," and the task has landed on your desk. You don't need another demo of a chatbot writing poems—you need to know which part of your actual operation to point this at first, without betting the quarter on a guess. This is the most common question we hear from operations leaders, and the honest answer is that picking the <span className="text-fg">right first project</span> matters more than picking the right tool.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        The goal of your first automation isn't to transform the company. It's to prove the approach works, build internal confidence, and learn how your team actually responds when a machine starts doing part of the job. A modest win that ships beats an ambitious project that stalls in month four. So the selection question is really: where is the lowest-risk, highest-clarity place to start?
      </p>

      {/* Section Divider */}
      <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim my-12 flex items-center gap-4">
        What Makes a Good First Candidate
        <span className="flex-1 h-px bg-border" />
      </div>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        Not every process is a good fit for early automation. The best first candidates share a recognisable shape. If you're scanning your operation for somewhere to begin, look for work that is:
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        <span className="text-fg">Repetitive and frequent.</span> A task that happens fifty times a day gives you fifty chances a day to see whether the automation works. Rare, once-a-quarter tasks take too long to validate and rarely justify the setup effort.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        <span className="text-fg">Rules-based, but tedious.</span> The sweet spot is work that follows fairly consistent logic—"if the invoice matches the purchase order, approve it"—but currently eats human hours because it's manual, not because it's hard. AI is strongest where the judgement is shallow but the volume is deep.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        <span className="text-fg">Bounded and observable.</span> You want a process with a clear start, a clear finish, and an output you can check. "Draft a reply to this support email" has an observable result a human can approve. "Improve customer happiness" does not.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        <span className="text-fg">Low blast radius if it's wrong.</span> Early on, you want mistakes to be cheap and recoverable. Drafting a first version of a document a human will review is forgiving. Sending money, deleting records, or messaging a client directly is not—save those for once you trust the system.
      </p>

      <div className="bg-surface border border-border p-6 my-8">
        <p className="text-fg font-serif text-[1.1rem] mb-3">The Ideal First Project, in One Line</p>
        <div className="font-mono text-[0.8rem] text-fg-dim leading-[1.8]">
          <div>High volume × Clear rules × Checkable output × Cheap to get wrong</div>
          <div className="mt-3 text-fg-dim text-[0.9rem]">Hit three of these four and you have a viable starting point. Hit all four and you have an obvious one.</div>
        </div>
      </div>

      {/* Section Divider */}
      <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim my-12 flex items-center gap-4">
        What to Avoid First
        <span className="flex-1 h-px bg-border" />
      </div>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        Just as important is knowing what <em className="text-accent">not</em> to start with. Three categories trip up teams repeatedly.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        <span className="text-fg">The high-stakes irreversible task.</span> Automating client-facing communications, financial transactions, or anything legally binding as your very first move puts maximum risk on minimum experience. These can absolutely be automated later, with human approval gates—but they're a poor place to learn.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        <span className="text-fg">The genuinely ambiguous judgement call.</span> If your best, most experienced people disagree on the right answer, AI won't settle it. Work that depends on deep context, negotiation, or reading a room is not where automation pays off early.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        <span className="text-fg">The process nobody can actually describe.</span> If you ask three people how something gets done and get three different answers, the process isn't ready to automate—it's ready to be documented. Automation forces clarity; it can't invent it.
      </p>

      {/* Section Divider */}
      <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim my-12 flex items-center gap-4">
        A Simple Shortlisting Exercise
        <span className="flex-1 h-px bg-border" />
      </div>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        You don't need a consultancy framework to find your first project. You need an hour, a whiteboard, and the people who actually do the work. Run this exercise:
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        <span className="text-fg">Step 1 — List the time sinks.</span> Ask each team to name the three tasks that consume the most hours and create the least satisfaction. The "I can't believe I still do this by hand" tasks. You'll get a surprisingly consistent list.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        <span className="text-fg">Step 2 — Score each one.</span> Rate every candidate from 1 to 5 on four axes: frequency, how rules-based it is, how checkable the output is, and how cheap a mistake would be. Add the scores. Anything above 16 is a strong contender.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        <span className="text-fg">Step 3 — Sanity-check the data.</span> For your top candidate, ask: does the AI actually have access to the information it needs to do this? A task that requires data trapped in a system nobody can connect to is a connection project first and an automation project second.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        <span className="text-fg">Step 4 — Define "done."</span> Before you build anything, write one sentence describing what success looks like and how you'll measure it. "Reduce the time to triage an inbound support ticket from eight minutes to under two, with a human still approving the final reply." If you can't write that sentence, you're not ready to start.
      </p>

      <blockquote className="border-l-2 border-accent pl-6 my-8 text-fg italic font-serif text-[1.1rem]">
        The first automation you ship teaches your organisation more than the ten you debate. Pick something small enough to finish and visible enough to matter.
      </blockquote>

      {/* Section Divider */}
      <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim my-12 flex items-center gap-4">
        Where Operational Teams Usually Land
        <span className="flex-1 h-px bg-border" />
      </div>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        Across the businesses we work with, a handful of first projects come up again and again because they fit the profile so cleanly. Inbox and ticket triage—reading inbound messages, categorising them, drafting a first-pass reply for a human to approve. Document data extraction—pulling fields out of invoices, contracts, or forms and dropping them into the right system. Reconciliation and matching—comparing two lists and flagging the exceptions a person should look at. Internal question-answering—letting staff ask plain-English questions against policies, product data, or past records instead of hunting through folders.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        What these share is the same shape: high volume, shallow judgement, a human still in the loop, and a result you can check at a glance. None of them are glamorous. All of them quietly return hours.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        Choosing well is the hard part, and it's where we spend the first conversation with most clients—before any tool is mentioned. At Crox we help operational teams map their processes, score the candidates honestly, and start where the risk is lowest and the learning is highest. Once that first project proves itself, the next ten are a much easier conversation.
      </p>
    </article>
  );
};

export default WhereToStartPost;
