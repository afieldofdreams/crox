import React from "react";

const AiAutomationRisksPost: React.FC = () => {
  return (
    <article className="prose prose-invert max-w-none">
      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        Somewhere between the excited pilot and the company-wide rollout, the questions get sharper. A board member asks what happens if the AI gets something wrong and a customer relies on it. The compliance lead asks where the data goes. Someone asks who is accountable when a machine makes a decision. These aren't obstacles to AI adoption—they're the questions that separate a durable programme from a liability. The aim isn't to eliminate risk, which is impossible, but to govern it well enough that you can move quickly with your eyes open.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        The good news is that the risks of AI automation are well-understood and largely controllable. The mistake is treating governance as a brake rather than a steering wheel. Done properly, it's what lets you say yes to more, not less.
      </p>

      {/* Section Divider */}
      <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim my-12 flex items-center gap-4">
        The Risks That Actually Matter
        <span className="flex-1 h-px bg-border" />
      </div>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        <span className="text-fg">Data exposure.</span> The first question your security and compliance people will ask is where your information goes. When an AI processes a customer record, does that data leave your control? Is it stored by a third party? Could it be used to train someone else's model? For regulated data—health, financial, legal, personal—these aren't abstract concerns. The answer depends entirely on how the system is built, which is why architecture matters as much as policy.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        <span className="text-fg">Accuracy and hallucination.</span> AI models can produce confident, fluent answers that are simply wrong. In a low-stakes draft, that's a minor edit. In a customer-facing reply, a financial calculation, or a compliance document, a confident error is a real problem. The risk isn't that the AI is wrong sometimes—it's that it's wrong in a way that <em className="text-accent">looks</em> right, so no one catches it.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        <span className="text-fg">Over-automation.</span> The temptation, once something works, is to remove the human entirely and let it run. But automating a decision that genuinely needs judgement—or removing oversight before you've earned trust in the system—turns a helpful tool into an unsupervised liability. Many of the worst AI incidents are not failures of the model; they're failures to keep a person in the loop where one belonged.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        <span className="text-fg">Accountability gaps.</span> When a person makes a decision, the line of responsibility is clear. When a process is automated, that line can blur—until something goes wrong and everyone discovers no one actually owned the outcome. "The system did it" is not an answer a regulator, a court, or a customer will accept.
      </p>

      {/* Section Divider */}
      <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim my-12 flex items-center gap-4">
        The Controls That Manage Them
        <span className="flex-1 h-px bg-border" />
      </div>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        Each of those risks has a corresponding control. None of them are exotic; they're the same disciplines you already apply to any sensitive process, adapted for AI.
      </p>

      <h2 className="font-serif font-normal text-[1.6rem] mb-4 mt-8 text-fg">
        Keep Data Under Your Control
      </h2>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        The strongest answer to data exposure is architectural: build so that sensitive data stays within your infrastructure and the AI is given only what it needs, for only as long as it needs it. Open standards like the Model Context Protocol are designed for exactly this—your credentials and data stay on your side, and the AI requests specific information through a controlled interface rather than being handed the keys. Choose providers with clear contractual commitments that your data won't be used for training, and know exactly which data crosses which boundary.
      </p>

      <h2 className="font-serif font-normal text-[1.6rem] mb-4 mt-8 text-fg">
        Put a Human at the Right Gate
      </h2>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        Human-in-the-loop is the single most effective control against both accuracy and over-automation risk—but the skill is placing the gate where it counts. Have the AI draft, and a person approve, anything that's customer-facing, financial, or hard to reverse. As confidence grows, you can raise the threshold: auto-approve the routine, route only the exceptions and high-value cases to a human. The principle is graduated trust, not all-or-nothing.
      </p>

      <div className="bg-surface border border-border p-6 my-8">
        <p className="text-fg font-serif text-[1.1rem] mb-3">Graduated Autonomy</p>
        <div className="font-mono text-[0.8rem] text-fg-dim leading-[1.8]">
          <div>Suggest → Human approves everything</div>
          <div>Assist → Human approves exceptions only</div>
          <div>Automate → Human audits a sample after the fact</div>
          <div className="mt-3 text-fg-dim text-[0.9rem]">Move down this list as evidence accumulates—never start at the bottom.</div>
        </div>
      </div>

      <h2 className="font-serif font-normal text-[1.6rem] mb-4 mt-8 text-fg">
        Log Everything
      </h2>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        You cannot govern what you cannot see. Every AI action—what data it accessed, what it produced, what decision it influenced—should be logged in a way you can audit later. A complete trail turns "we think it's working" into "here is exactly what happened, and when." For regulated industries this isn't optional; it's the difference between demonstrating control and hoping no one asks. Well-built integrations make this logging automatic rather than an afterthought.
      </p>

      <h2 className="font-serif font-normal text-[1.6rem] mb-4 mt-8 text-fg">
        Name an Owner
      </h2>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        Every automated process needs a named human owner—someone accountable for its outcomes, who can explain what it does, and who has the authority to pause it. Automation doesn't transfer responsibility to the machine; it concentrates it on whoever owns the machine. Making that explicit, in writing, closes the accountability gap before it opens.
      </p>

      <blockquote className="border-l-2 border-accent pl-6 my-8 text-fg italic font-serif text-[1.1rem]">
        Good AI governance isn't a wall that stops you. It's the set of brakes that lets you take the corner faster.
      </blockquote>

      {/* Section Divider */}
      <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim my-12 flex items-center gap-4">
        Start Safe, Then Widen
        <span className="flex-1 h-px bg-border" />
      </div>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        The pattern that keeps organisations out of trouble is the same one that gets them moving: begin where the stakes are low and the output is checkable, keep a human firmly in the loop, log everything from day one, and widen the autonomy only as the evidence earns it. Each step compounds the trust—and the data—you need to take the next one safely.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        This is why the governance conversation and the technical conversation can't be separated. Whether your data stays under your control, whether every action is auditable, whether a human sits at the right gate—these are determined by <span className="text-fg">how the system is built</span>, not by a policy document written afterward. The architecture is the control.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        That's the lens we bring at Crox. We build AI integrations on open standards so your data stays yours, every action is logged, and human approval sits exactly where your risk appetite says it should—so you can adopt AI at the pace your business needs without handing your governance to a black box.
      </p>
    </article>
  );
};

export default AiAutomationRisksPost;
