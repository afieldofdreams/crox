import React from "react";

const BuildBuyPartnerPost: React.FC = () => {
  return (
    <article className="prose prose-invert max-w-none">
      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        Once you've decided to add AI to your operations, a fork in the road appears almost immediately: do you buy a ready-made tool, build something yourself, or bring in a partner to do it with you? It's framed as a technology decision, but it's really a question about risk, control, and where you want your team's time to go. Choose wrong and you either pay for capability you'll never use, or sink months into building something you could have bought for a fraction of the cost.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        There's no universally correct answer—only the right answer for a specific problem at a specific point in your company's maturity. This is a way to reason about the choice rather than a verdict.
      </p>

      {/* Section Divider */}
      <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim my-12 flex items-center gap-4">
        Buy: Off-the-Shelf Tools
        <span className="flex-1 h-px bg-border" />
      </div>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        Buying means adopting a product that already does the thing you want—an AI feature inside software you already run, or a dedicated tool you subscribe to. The CRM that now drafts your follow-up emails, the support desk with AI triage built in, the meeting tool that writes the summary.
      </p>

      <div className="bg-surface border border-border p-6 my-8">
        <p className="text-fg font-serif text-[1.1rem] mb-3">Buy</p>
        <div className="font-mono text-[0.8rem] text-fg-dim leading-[1.8]">
          <div>Vendor builds and maintains → You configure and use</div>
          <div className="mt-3 text-fg-dim text-[0.9rem]">Fastest to value, lowest control, shared roadmap.</div>
        </div>
      </div>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        <span className="text-fg">When buying wins:</span> the problem is common, not unique to you; a good product already exists; and the AI feature works on data that already lives inside that product. If your need is "summarise support tickets" and your support tool offers exactly that, building your own version would be a waste. You get value in days, the vendor handles maintenance and improvements, and the cost is predictable.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        <span className="text-fg">The limitations:</span> you get what the vendor decides to build, on their timeline. The feature usually only sees data inside that one product, so if your real problem spans several systems, no single tool covers it. And you're exposed to their pricing and roadmap—if they triple the price or drop the feature, you adapt. For a process that isn't core to your competitive edge, that trade is usually fine.
      </p>

      {/* Section Divider */}
      <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim my-12 flex items-center gap-4">
        Build: In-House Development
        <span className="flex-1 h-px bg-border" />
      </div>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        Building means your own people create the automation—wiring AI models to your systems, your data, and your specific logic. It's the path with the most control and the most responsibility.
      </p>

      <div className="bg-surface border border-border p-6 my-8">
        <p className="text-fg font-serif text-[1.1rem] mb-3">Build</p>
        <div className="font-mono text-[0.8rem] text-fg-dim leading-[1.8]">
          <div>Your team designs, builds, and owns → forever</div>
          <div className="mt-3 text-fg-dim text-[0.9rem]">Maximum control and fit, maximum maintenance burden.</div>
        </div>
      </div>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        <span className="text-fg">When building wins:</span> the process is genuinely specific to how you operate, it touches data across several systems, and it's close enough to your competitive advantage that owning it matters. If the automation <em className="text-accent">is</em> the product—or a real differentiator—you probably don't want it locked inside someone else's roadmap.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        <span className="text-fg">The limitations:</span> building is the most expensive option once you count the full cost, and most of that cost arrives <em className="text-accent">after</em> launch. Someone has to maintain it, update it as the underlying AI models change, fix it when a connected system changes its API, and own it when the person who built it leaves. Teams routinely underestimate this. Building also requires scarce talent—people who understand both your business and the technology—and every hour they spend reinventing a commodity is an hour not spent on what only you can do.
      </p>

      {/* Section Divider */}
      <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim my-12 flex items-center gap-4">
        Partner: Build With Help
        <span className="flex-1 h-px bg-border" />
      </div>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        Partnering sits between the two. A specialist builds the custom integration for you—or alongside your team—using standards and patterns they've applied before, then hands over something you own without your team having to learn every lesson the hard way.
      </p>

      <div className="bg-surface border border-border p-6 my-8">
        <p className="text-fg font-serif text-[1.1rem] mb-3">Partner</p>
        <div className="font-mono text-[0.8rem] text-fg-dim leading-[1.8]">
          <div>Specialist builds to an open standard → You own and operate</div>
          <div className="mt-3 text-fg-dim text-[0.9rem]">Custom fit without the full in-house burden, if the handover is clean.</div>
        </div>
      </div>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        <span className="text-fg">When partnering wins:</span> you need something custom, but you don't have—or don't want to tie up—the in-house talent to build it from scratch, and you'd rather not carry the whole maintenance burden alone. A good partner brings patterns that avoid the expensive mistakes, builds on open standards so you aren't locked to them, and leaves you with something you can actually run.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        <span className="text-fg">The thing to check:</span> partnering only works if the result is genuinely yours. Ask directly—who owns the code, what standards is it built on, and could another team or vendor take it over if we parted ways? A partner who builds on open foundations like the Model Context Protocol leaves you independent. One who locks you into a proprietary black box has simply sold you a more expensive version of vendor lock-in.
      </p>

      {/* Section Divider */}
      <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim my-12 flex items-center gap-4">
        The Hidden Costs Everyone Forgets
        <span className="flex-1 h-px bg-border" />
      </div>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        Whichever path you lean toward, compare them on <span className="text-fg">total cost of ownership</span>, not sticker price. The costs that ambush teams are almost always the recurring ones: ongoing AI usage charges that scale with volume, the maintenance to keep integrations working as connected systems change, the internal time to monitor quality, and the switching cost if you ever need to move. A "cheap" build that needs a developer's constant attention can cost more over three years than a "pricey" tool that simply works.
      </p>

      <blockquote className="border-l-2 border-accent pl-6 my-8 text-fg italic font-serif text-[1.1rem]">
        Buy the commodity. Build or partner on the thing that's actually yours. The mistake is doing it the other way around.
      </blockquote>

      {/* Section Divider */}
      <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim my-12 flex items-center gap-4">
        A Decision Checklist
        <span className="flex-1 h-px bg-border" />
      </div>

      <div className="bg-surface border border-border p-6 my-8">
        <div className="space-y-4">
          <div>
            <p className="text-fg font-mono text-[0.9rem] mb-2">Is the problem common or unique to us?</p>
            <p className="text-fg-dim text-[0.9rem]">Common → lean Buy. Unique to your operation → lean Build or Partner.</p>
          </div>
          <div className="pt-2 border-t border-border">
            <p className="text-fg font-mono text-[0.9rem] mb-2">Does it span one system or many?</p>
            <p className="text-fg-dim text-[0.9rem]">One system → a built-in feature may cover it. Many → you need integration, which points to Build or Partner.</p>
          </div>
          <div className="pt-2 border-t border-border">
            <p className="text-fg font-mono text-[0.9rem] mb-2">Is it core to our competitive edge?</p>
            <p className="text-fg-dim text-[0.9rem]">Core → own it (Build/Partner). Supporting → buying is usually smarter.</p>
          </div>
          <div className="pt-2 border-t border-border">
            <p className="text-fg font-mono text-[0.9rem] mb-2">Do we have the talent to maintain it?</p>
            <p className="text-fg-dim text-[0.9rem]">Yes, with capacity to spare → Build is viable. No → Buy, or Partner with a clean handover.</p>
          </div>
          <div className="pt-2 border-t border-border">
            <p className="text-fg font-mono text-[0.9rem] mb-2">How much does lock-in cost us later?</p>
            <p className="text-fg-dim text-[0.9rem]">High → favour open standards, whether you build or partner. Low → a proprietary tool is an acceptable trade.</p>
          </div>
        </div>
      </div>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        Most organisations end up with a mix: buying for the commodity tasks, and building or partnering for the few processes that are genuinely theirs. The skill is sorting your list into those two buckets honestly, rather than defaulting to "build everything" out of ambition or "buy everything" out of caution.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        When the answer points toward custom work, this is where we fit. At Crox we build AI integrations on open standards, so you get the fit of a bespoke solution without taking on the full in-house burden—and you keep something you genuinely own, with no black box and no lock-in. If buying is the smarter call for a given task, we'll tell you that too.
      </p>
    </article>
  );
};

export default BuildBuyPartnerPost;
