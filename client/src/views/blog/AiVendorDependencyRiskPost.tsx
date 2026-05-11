import React from 'react';

export const AiVendorDependencyRiskPost: React.FC = () => {
  return (
    <div className="space-y-6">
      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        In late March 2026, Anthropic accidentally exposed 512,000 lines of internal source code via a public npm package. The full system prompt architecture. Evidence of unannounced features. The kind of thing you file a DMCA takedown over and hope the internet cooperates.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        Anthropic called it "a release packaging issue caused by human error, not a security breach." They are technically right. No customer data was exposed. The takedowns were filed quickly.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        They are also missing the point.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        For teams building AI products in healthcare, legal, finance, or any sector where decisions have consequences beyond a refund, the story is not about the leak. It is about what the leak reveals about the risk structure you are standing in.
      </p>

      <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim my-12 flex items-center gap-4">
        Security versus quality management
        <span className="flex-1 h-px bg-border" />
      </div>

      <h2 className="font-serif font-normal text-[1.6rem] mb-4 mt-8">
        The problem is not security. It is quality management.
      </h2>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        A security breach means someone got in. A process error means the internal controls failed to catch something before it went out.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        Security can be hardened at a perimeter. Quality management is systemic. It lives in how a team writes procedures, trains engineers, reviews releases, and catches mistakes before they become events. When a quality management problem surfaces, it surfaces as an incident. But the problem existed long before the incident.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        In a regulated sector, you cannot outsource this distinction. The Care Quality Commission, the MHRA, the ICO, and the solicitors representing harmed patients do not draw a line between your AI vendor's quality management failures and your own. You built a product on that infrastructure. You deployed it in a care setting. You made the decision.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        Your vendor's process failure is your regulatory exposure.
      </p>

      <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim my-12 flex items-center gap-4">
        Risk categories you have not named
        <span className="flex-1 h-px bg-border" />
      </div>

      <h2 className="font-serif font-normal text-[1.6rem] mb-4 mt-8">
        What platform dependency actually means
      </h2>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        Building on an AI platform is now a standard architectural choice. Reasonable, often necessary. Most teams would spend years trying to replicate what Anthropic, OpenAI, or Google have built.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        But dependency is not neutral. It creates specific risk categories that most product teams have not named or assessed.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        <span className="text-fg font-medium">Supply chain risk.</span> Your product's behaviour is downstream of your vendor's system prompts, safety layers, and model updates. When the model changes, your product changes. You may not be told. You may not notice for days.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        <span className="text-fg font-medium">Feature risk.</span> The Anthropic leak revealed unannounced capabilities: autonomous payment systems, proactive action modes. These are being built into the infrastructure your product depends on. Were you consulted? Did you do a risk assessment on capabilities that did not exist when you signed the contract? If a capability is released and your product's behaviour changes in a way that affects a patient, the fact that it was your vendor's decision and not yours is an interesting argument. It is not a defence.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        <span className="text-fg font-medium">Accountability gap.</span> When something goes wrong in a regulated product, there is a chain of accountability: the practitioner, the product, the infrastructure. Courts and regulators are actively developing their thinking on where AI vendor liability sits. In the meantime, you are in the gap.
      </p>

      <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim my-12 flex items-center gap-4">
        Trust versus assessment
        <span className="flex-1 h-px bg-border" />
      </div>

      <h2 className="font-serif font-normal text-[1.6rem] mb-4 mt-8">
        The difference between two sentences
      </h2>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        "I trust this tool" and "I've assessed the risk of depending on this tool" are different sentences.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        The first describes a relationship. The second describes a process. In regulated sectors, only the second is defensible.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        Assessing vendor dependency risk looks like this:
      </p>

      <ul className="list-disc pl-6 space-y-3 text-[0.95rem] text-fg-dim leading-[1.8]">
        <li>What happens to my product if my vendor makes an unannounced model update?</li>
        <li>What notification requirements exist in my contract when new capabilities are added?</li>
        <li>How do I detect behavioural drift in my product's outputs after a vendor change?</li>
        <li>What is my fallback if my vendor has an outage, a breach, or an incident that makes headlines the week I have a CQC inspection?</li>
        <li>Can I produce a vendor risk assessment and keep it current?</li>
      </ul>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        These are not questions most product teams have answered. They are not questions most vendor contracts require you to answer. They are questions a regulator or a solicitor will ask if something goes wrong.
      </p>

      <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim my-12 flex items-center gap-4">
        Three steps
        <span className="flex-1 h-px bg-border" />
      </div>

      <h2 className="font-serif font-normal text-[1.6rem] mb-4 mt-8">
        What to do
      </h2>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        None of this means you should not build on AI platforms. It means you should build with the same rigour you would apply to any infrastructure choice in a regulated environment.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        Three steps.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        <span className="text-fg font-medium">First:</span> document your dependencies. Name every AI vendor touching your product. Map what they control. For each one, write one sentence on what changes in your product if they have a bad day. If you cannot write that sentence, you do not understand the dependency.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        <span className="text-fg font-medium">Second:</span> build detection into your product. You should be able to detect when your product's behaviour shifts, even if the cause is upstream. If you cannot tell the difference between your product working normally and your product working on a degraded model, you have an audit problem.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        <span className="text-fg font-medium">Third:</span> read your contracts. Most AI vendor contracts give the vendor significant latitude to update models, change terms, and modify capabilities. Know what yours says. Know what notice you get. Know what remedies exist.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        None of this guarantees a clean audit. It puts you in a position to have a conversation about risk management rather than a conversation about why you did not think about it.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        The Anthropic incident resolved quickly. The next one will be different. Plan accordingly.
      </p>

      <blockquote className="border-l-2 border-accent pl-6 my-8 text-fg italic font-serif text-[1.1rem]">
        Crox builds AI systems for regulated sectors. If your product involves healthcare, legal, or compliance decisions,{' '}
        <a href="/contact" className="text-fg border-b border-border pb-px hover:border-accent transition-colors not-italic font-sans text-[0.95rem]">
          we can help you think through vendor dependency
        </a>
        {' '}before it becomes an incident.
      </blockquote>
    </div>
  );
};
