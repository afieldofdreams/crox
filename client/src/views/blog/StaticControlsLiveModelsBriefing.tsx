import React from 'react';

const SectionDivider: React.FC<{ label: string }> = ({ label }) => (
  <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim my-12 flex items-center gap-4">
    {label}
    <span className="flex-1 h-px bg-border" />
  </div>
);

const P: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-[0.95rem] text-fg-dim leading-[1.8]">{children}</p>
);

export const StaticControlsLiveModelsBriefing: React.FC = () => {
  return (
    <div className="space-y-6">
      <p className="font-mono text-[0.75rem] tracking-[0.15em] uppercase text-accent">
        Briefing &middot; A working document. Free to read. No email gate. Free to forward.
      </p>

      <SectionDivider label="Why this exists" />

      <P>
        I do not sit on boards. I work inside the firms whose boards are being briefed on AI, and I see the gap between what gets written into the board pack and what is actually deployed. This is the briefing I keep wanting to put in front of the boards on the other side of that gap. It is not a policy template. It is not a maturity model. It is a working document for boards and exec teams who already know AI matters and have stopped finding the policy-and-committee playbook reassuring.
      </P>

      <P>
        It is short on prescriptions and long on the diagnostic question that I think is being missed in most board packs: when the model your firm depends on changes silently next Thursday, what is your process?
      </P>

      <P>
        I will name five lenses I think are more useful than the standard governance framework. I will cite the cases. I will not soften where the conventional advice is structurally insufficient.
      </P>

      <P>The piece is free, ungated, and written to be forwarded.</P>

      <h2 className="font-serif font-normal text-[1.8rem] mb-4 mt-12 text-fg">
        1. The confidence gap
      </h2>

      <P>
        Two August 2026. The European Union's AI Act high-risk obligations begin to bind. Conformity assessments, post-market monitoring, fundamental-rights impact assessments for the public-sector and credit-and-insurance use cases, serious-incident reporting on a fifteen-day clock and a two-day clock for fundamental-rights breaches. Penalties up to thirty-five million euros or seven percent of global turnover.
      </P>

      <P>
        The Commission proposed deferring the deadline to December 2027 in the Digital Omnibus on AI, published on 19 November 2025. The second political trilogue between Parliament, Council, and Commission ended without agreement on 28 April 2026. As of writing, the original deadline still binds as drafted. Many boards spent the last six months planning around a delay that did not land.
      </P>

      <P>
        That is the regulatory backdrop. The harder problem is that the firms I work inside have no honest read on whether their board can answer for the obligation if it does land.
      </P>

      <P>
        The numbers are stark and consistent across the major surveys. McKinsey's <em>State of AI</em> reports roughly sixty-five percent of organisations now using generative AI regularly, up from a third the year before. The same survey finds fewer than twenty percent of those organisations have board-level AI governance in any meaningful sense. The NACD's 2024 governance survey found AI moved from the fourteenth most cited board concern to the top five inside twelve months, while fewer than a quarter of directors believe their board has the expertise to oversee it. PwC's directors survey put it more bluntly: most directors say AI is a regular agenda item; less than one in five say their organisation has a formal AI strategy that the board signs off.
      </P>

      <blockquote className="border-l-2 border-accent pl-6 my-8 text-fg italic font-serif text-[1.1rem]">
        The gap between we are using it and we know how to oversee it is the story.
      </blockquote>

      <P>
        Inside individual board packs the pattern is equally consistent. I have seen the same artefact in roughly the same form a dozen times in the last year. There is an AI committee, often chaired by the CIO and reporting to the audit committee. There is a vendor list, usually reviewed annually. There is a risk assessment, often produced by a Big Four firm during the procurement cycle that closed last spring. There is a policy document, sometimes good, often a re-skinned data-protection policy with the word "AI" inserted in the operative clauses.
      </P>

      <P>
        What is missing is a process. Specifically, a process for what happens when the model the organisation depends on changes shape between two board meetings.
      </P>

      <P>That gap is what this briefing is about.</P>

      <h2 className="font-serif font-normal text-[1.8rem] mb-4 mt-12 text-fg">
        2. Why the conventional playbook is structurally insufficient
      </h2>

      <P>
        The standard advice on adopting AI in regulated industries reads, in shorthand, like this: write a policy, set up an ethics committee, run a risk assessment, pick a SOC 2 vendor, train your people, and renew the cycle annually. It is the framework most boards have implemented or are implementing. It is also the framework that has failed in every named AI incident of the last three years.
      </P>

      <P>It fails for four structural reasons.</P>

      <h3 className="font-serif font-normal text-[1.2rem] mb-3 mt-8 text-fg">
        SOC 2 covers security, not algorithmic fairness
      </h3>

      <P>
        Workday holds SOC 2 Type II certification. That did not prevent <em>Mobley v. Workday</em> reaching collective certification under the Age Discrimination in Employment Act in May 2025, in the Northern District of California. The court allowed nationwide collective action against the vendor directly, on an "agent" theory of liability under Title VII. Workday represented in court filings that approximately 1.1 billion applications had been rejected via its tools across the relevant period. The collective could potentially include hundreds of millions of applicants. The defending companies bought a SOC 2-certified product through their existing procurement process. The control framework did not address the actual risk surface.
      </P>

      <h3 className="font-serif font-normal text-[1.2rem] mb-3 mt-8 text-fg">
        One-time risk assessments break under silent retraining
      </h3>

      <P>
        The cleanest illustration is healthcare. Wong et al., publishing in <em>JAMA Internal Medicine</em> in 2021, validated the Epic Sepsis Model in real-world deployment across hundreds of US hospitals. The vendor's claimed sensitivity was 76 percent. The real-world sensitivity was 33 percent. The model had been retrained without coordinated re-validation across deployment sites. Hospitals that had performed validation against the vendor's recommended methodology now had a workflow that was, in regulatory terms, no longer validated. Nobody told the audit committees. The model was a moving object inside a static control.
      </P>

      <h3 className="font-serif font-normal text-[1.2rem] mb-3 mt-8 text-fg">
        Ethics committees with no veto power consistently fail
      </h3>

      <P>
        Google's Advanced Technology External Advisory Council, announced March 2019, dissolved nine days later under internal pressure. Microsoft's Ethics and Society team was disbanded in March 2023. Twitter's Machine Learning Ethics, Transparency and Accountability team was disbanded in November 2022. The pattern is not coincidental. Where the ethics committee has no authority over product timelines, the structure produces compliance theatre. Where it has authority, it tends to be quietly dissolved when timelines press.
      </P>

      <h3 className="font-serif font-normal text-[1.2rem] mb-3 mt-8 text-fg">
        Vendor liability flows to the client, and increasingly to the vendor as well
      </h3>

      <P>
        <em>Moffatt v. Air Canada</em>, decided by the British Columbia Civil Resolution Tribunal in February 2024, rejected the airline's argument that its chatbot was "a separate legal entity" responsible for its own statements. The damages were small. The doctrinal weight is large. A company is liable for its chatbot's representations as for any other agent's. Mobley extends the same principle to AI vendors directly. The Italian Garante's fifteen-million-euro fine on OpenAI, issued on 20 December 2024, applied GDPR principles to model-training practices. The default assumption that "we bought it from a reputable supplier" insulates the firm is not surviving contact with the courts.
      </P>

      <P>
        The unifying observation is uncomfortable. Every named case in the last three years involved a vendor or system that had passed somebody's procurement gate. The control framework that approved them is the control framework most boards still rely on.
      </P>

      <P>
        There is also the parallel happening in slow motion in the United Kingdom. The Post Office Horizon Inquiry, sitting through 2025 and 2026, is apportioning blame for software-trust failures of the early 2000s. Over nine hundred wrongful prosecutions. A compensation programme exceeding one billion pounds. The system was single-sourced, opaque, and treated as authoritative by the people it harmed. The structural failure was not the technology. It was the absence of a challenge mechanism inside the supplier-customer-regulator triangle.
      </P>

      <blockquote className="border-l-2 border-accent pl-6 my-8 text-fg italic font-serif text-[1.1rem]">
        Boards approving black-box AI in 2026 are doing so while the courts are still apportioning blame for black-box software approved in the 2000s.
      </blockquote>

      <P>That should sit uncomfortably with anyone signing the assurance letter.</P>

      <h2 className="font-serif font-normal text-[1.8rem] mb-4 mt-12 text-fg">
        3. Five lenses
      </h2>

      <P>
        I want to offer five lenses that I think serve a board better than the conventional checklist. They are not steps. They are not in any particular order. They are the questions I would put in front of a board if I were briefing one tomorrow.
      </P>

      <h3 className="font-serif font-normal text-[1.3rem] mb-3 mt-10 text-fg">
        3.1 Treat AI as supply-chain risk, not policy risk
      </h3>

      <P>
        The defining property of an AI system in production is not that it is intelligent. It is that it is a dependency that changes. Models are retrained. Capabilities are updated. Safety filters are tightened or loosened. Pricing and rate limits move. The version of the system your audit committee approved in Q3 is not the version your customers are interacting with in Q1 of the following year.
      </P>

      <P>
        This is the property the conventional governance framework has not absorbed. A risk assessment is a snapshot. A policy is a snapshot. A vendor approval is a snapshot. The thing being governed is not.
      </P>

      <P>
        The right lens is supply-chain risk, applied with the same rigour boards already apply to physical supply chains. What are our critical dependencies? Who are the second and third-tier suppliers our supplier depends on? What is our contractual right to be told when those dependencies change?
      </P>

      <P>
        The practical question every board should be asking its general counsel this quarter is straightforward.
      </P>

      <blockquote className="border-l-2 border-accent pl-6 my-8 text-fg italic font-serif text-[1.1rem]">
        Show me a vendor contract for a critical AI dependency. Where is the clause that requires advance notice of model change? Where is the clause that requires the supplier to disclose which third-party model they use, and tell us when they switch it? What is our remedy if they do not?
      </blockquote>

      <P>
        The honest answer in most procurement signed during 2023 and 2024 is that those clauses do not exist. Suppliers were not offering them. Buyers were not asking for them. Both sides were treating the model as a fixed input. The next procurement cycle is the chance to fix that, and the firms that take it will have a meaningful structural advantage on the firms that do not.
      </P>

      <h3 className="font-serif font-normal text-[1.3rem] mb-3 mt-10 text-fg">
        3.2 Build change detection, not snapshot validation
      </h3>

      <P>
        I flew commercially for several years before I went into technology. The thing that struck me most when I left aviation for tech, and the thing I keep returning to every time I look at an AI-adoption programme from the operator seat inside a regulated firm, is the difference in how each industry thinks about safety.
      </P>

      <P>
        Aviation made a transition over decades. The early model was incident-based: an accident happened, an investigation followed, a directive was issued, the directive was implemented. By the 1990s the industry recognised this was not enough. Safety Management Systems, codified by ICAO and now mandatory under most national authorities, moved the industry from incident response to systemic risk management. Continuous monitoring. Voluntary reporting. Trend detection. The premise was that the next accident is best prevented by detecting the precursor pattern before it becomes an accident.
      </P>

      <P>
        The AI estate inside most regulated firms is at the equivalent of incident-based safety. A risk assessment is run. A vendor is approved. A failure happens. The firm responds. The cycle resets.
      </P>

      <P>
        The shift the regulated estate now needs is the same shift aviation made. Continuous monitoring rather than periodic assessment. The board's question moves from "have we validated the model" to "how would we know if it changed". The technical primitives exist. Eval-in-production. Shadow logging. Output drift detection. Model-card discipline. Change advisory boards adapted for non-deterministic systems.
      </P>

      <P>
        What is in short supply is not the technical capability. It is the audit-committee literacy to ask whether it is in place, and the willingness to fund it as infrastructure rather than as project work. The internal-audit profession is catching up but is not yet there. ICAEW, FRC, AICPA all have working groups. None has yet published a settled assurance standard for LLM-driven controls. That gap will close. In the meantime the board has to drive it.
      </P>

      <h3 className="font-serif font-normal text-[1.3rem] mb-3 mt-10 text-fg">
        3.3 Connect AI accountability to existing governance, not to a parallel committee
      </h3>

      <P>
        The strongest argument for not creating a new AI ethics committee is that the chair is already accountable. The chief executive of a UK-regulated financial services firm is already personally accountable under the Senior Managers and Certification Regime for the outcomes of the firm's algorithmic systems. The directors of a UK-listed company are already bound by fiduciary duty for the firm's material risks. The deployer of a high-risk AI system under the EU AI Act is bound by the Act's obligations whether or not they have set up a committee. The Care Quality Commission registered manager of a UK care home is already accountable for the outcomes of any decision-support tool used in care delivery.
      </P>

      <blockquote className="border-l-2 border-accent pl-6 my-8 text-fg italic font-serif text-[1.1rem]">
        The accountability is already there. The structure to discharge it is not.
      </blockquote>

      <P>
        The dysfunction of the parallel-ethics-committee model is that it dilutes the accountability. The chair signs off the policy that says "the AI ethics committee will assure outcomes". The committee then either has no power to alter the product roadmap, in which case it produces theatre, or has power to alter it, in which case the timeline-owners gradually arrange for it to be dissolved.
      </P>

      <P>
        The lens that works is direct. Map the AI risk surface to the named individuals and committees that already carry the accountability. The audit committee already owns control-environment risk. The risk committee already owns enterprise risk. The remuneration committee already owns conduct risk. The chair already owns reputational risk. AI is a vector through each of those, not a category outside them. Treat it that way.
      </P>

      <P>
        The failure mode this lens addresses is the most common pattern I see. A board creates an AI ethics committee, marks the agenda item closed, and the audit committee chair concludes she does not need to ask the question because someone else is.
      </P>

      <h3 className="font-serif font-normal text-[1.3rem] mb-3 mt-10 text-fg">
        3.4 Sanction shadow AI, do not ban it
      </h3>

      <P>
        Microsoft's <em>Work Trend Index</em> reported in May 2024 that 78 percent of AI users at work bring their own AI tools. That figure climbs to 80 percent in small and medium-sized enterprises and is consistent across every working generation. Cyberhaven Labs has tracked the data side: roughly 4.7 percent of employees pasting company data into generative-AI tools in any given quarter, with around eleven percent of pasted content classified as confidential.
      </P>

      <P>
        The shadow estate is real. It is not a fringe. It is the median behaviour of the median knowledge worker.
      </P>

      <P>
        The first reflex inside regulated firms in 2023 was to ban it. Samsung, Apple, JPMorgan, Bank of America, Citi, Goldman, Verizon, Amazon all imposed restrictions in the first wave. The bans worked for a quarter or two, then employee productivity pressure broke them. By mid-2024 the same banks had largely pivoted. JPMorgan rolled out its LLM Suite to approximately sixty thousand employees. Morgan Stanley deployed a GPT-4-based assistant in advisor workflows. The model was no longer ban-and-enforce. It was deploy-faster-than-they-go-rogue.
      </P>

      <P>
        That pivot is the lesson. Banning is structurally lossy because the productivity demand is real and the alternatives are accessible. Sanctioning at speed is the actual control. The board's effective question is not "have we banned ChatGPT" but "how fast can we put a sanctioned, contractually-controlled, audit-logged tool in our employees' hands, and what is the gap during which they will use the unauthorised one?"
      </P>

      <P>
        The corollary for the data-protection officer is that the data classification policy signed off in 2022 was almost certainly not designed for paste as an exfiltration vector. Half the workforce now exfiltrates data this way, not maliciously, but in pursuit of productivity gains the firm wants. Either the classification policy gets updated to address it, or the firm has a perpetual standing data-protection breach it has chosen not to see.
      </P>

      <h3 className="font-serif font-normal text-[1.3rem] mb-3 mt-10 text-fg">
        3.5 Pre-mortem the reputation event
      </h3>

      <P>
        When AI failures become public reputational events, the structure is consistent enough to be useful as a planning tool.
      </P>

      <P>
        <strong className="text-fg font-normal">There is a sympathetic individual victim.</strong> The Belastingdienst falsely accused approximately twenty-six thousand families, disproportionately of dual nationality, of childcare-benefit fraud over several years; the case toppled the Rutte government in 2021 and the compensation programme is still running. Air Canada's chatbot misrepresented bereavement-fare policy to a recently bereaved customer. Workday's tools rejected applications, allegedly on the basis of age, without giving applicants any way to contest the decision.
      </P>

      <P>
        <strong className="text-fg font-normal">There is a policy defensible on paper and indefensible in plain English.</strong> The Belastingdienst's risk-scoring methodology was approved internally and described in technocratic language; in the press, "the algorithm flagged dual-nationality families for fraud" was the only sentence anyone needed.
      </P>

      <P>
        <strong className="text-fg font-normal">There is a quotable number.</strong> Twenty-six thousand families. One point one billion applications. Thirty-three percent against a vendor-claimed seventy-six. A 365,000-dollar EEOC settlement. Fifteen million euros from the Italian Garante.
      </P>

      <P>
        The pre-mortem exercise that follows naturally is the one to put in front of the audit committee.
      </P>

      <blockquote className="border-l-2 border-accent pl-6 my-8 text-fg italic font-serif text-[1.1rem]">
        Sit a tabletop. Choose a plausible failure mode. Ask the head of communications to answer three questions before the journalist does. Who is the named victim. What is the number. Can the policy be explained to a non-technical reader in one sentence.
      </blockquote>

      <P>
        If the head of comms cannot answer those questions, the controls underneath are not real. They are paperwork. The exercise will surface that, fast, in a way that another iteration of the policy document will not.
      </P>

      <P>
        This is the lens that consistently changes the temperature in the room. It is also, I find, the one most boards have not yet run.
      </P>

      <h2 className="font-serif font-normal text-[1.8rem] mb-4 mt-12 text-fg">
        4. The August 2026 forcing function
      </h2>

      <P>
        The reason this briefing carries some urgency rather than being a long-running diagnostic is the EU AI Act high-risk timetable.
      </P>

      <P>
        What changes on 2 August 2026, assuming the original deadline holds, is the obligations under Articles 16 to 27 of the Act for providers and deployers of high-risk AI systems. Annex III of the Act identifies the categories: employment screening and decisions, credit scoring, life and health insurance pricing, education access, essential public services, law enforcement, migration and border, and administration of justice. Anything in those categories meets the high-risk threshold by use, regardless of model.
      </P>

      <P>
        The obligations include: a documented quality management system, a risk management system maintained throughout the lifecycle, data governance proportionate to the use case, technical documentation, logging, human oversight, accuracy and robustness, post-market monitoring, and serious-incident reporting. For deployers in the public sector and in banking and insurance, a Fundamental Rights Impact Assessment is mandatory. For all deployers, the incident-reporting clock is fifteen days from awareness, two days for breaches involving fundamental rights or critical infrastructure.
      </P>

      <P>
        The Digital Omnibus proposal of 19 November 2025 sought to defer this to 2 December 2027. The second trilogue on 28 April 2026 ended without agreement. The Commission has not withdrawn the proposal and there are political signals it could return. As of writing, no formal amendment has been adopted. The 2 August 2026 deadline binds as drafted.
      </P>

      <P>
        What "ready" looks like for a board on this is not a policy statement. It is a working answer to four operational questions.
      </P>

      <div className="space-y-4 my-8 pl-6 border-l-2 border-accent">
        <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
          <strong className="text-fg font-normal">Who runs the FRIA?</strong> If the answer is "a working group", the answer is not yet there.
        </p>
        <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
          <strong className="text-fg font-normal">Who logs the incident?</strong> Specifically, who decides within two business days whether an event meets the fundamental-rights-breach threshold, and who picks up the phone to the AI Office?
        </p>
        <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
          <strong className="text-fg font-normal">Who reads the post-market monitoring?</strong> Continuous monitoring without a named human consuming it is shelf-ware.
        </p>
        <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
          <strong className="text-fg font-normal">Who reports it to the audit committee?</strong> And on what cadence? Quarterly is too slow given the fifteen-day external clock. Monthly with exception-based escalation is the working pattern that I have seen function.
        </p>
      </div>

      <P>
        The technical readiness is achievable for most regulated firms in the time available. The organisational readiness, in my experience, is not. The gap is closable. The first step is naming the four owners.
      </P>

      <h2 className="font-serif font-normal text-[1.8rem] mb-4 mt-12 text-fg">
        5. Close
      </h2>

      <P>
        The aviation move from incident-based to systemic safety took about fifty years and a number of accidents nobody wants the names of. The AI cycle is faster, and the incidents will be public in months rather than decades.
      </P>

      <P>
        The work is not in writing more policy. It is in building the change-detection muscle. Inside an existing governance framework that already binds the chair to the outcome.
      </P>

      <blockquote className="border-l-2 border-accent pl-6 my-8 text-fg italic font-serif text-[1.3rem]">
        If the model changed last Thursday, who told the board?
      </blockquote>

      <SectionDivider label="Sources and references" />

      <ol className="space-y-3 list-decimal list-outside pl-6 text-[0.85rem] text-fg-dim leading-[1.7]">
        <li>Council of the EU and European Parliament, <em>Regulation (EU) 2024/1689 (AI Act)</em>, OJ L 2024/1689, particularly Articles 6, 9 to 17, 27, 72; Annex III.</li>
        <li>European Commission, <em>Digital Omnibus on AI</em>, 19 November 2025; trilogue status reported by IAPP and DLA Piper, April to May 2026.</li>
        <li>European AI Office and AI Act implementation timeline: artificialintelligenceact.eu/implementation-timeline; digital-strategy.ec.europa.eu.</li>
        <li>Mobley v. Workday, Inc., 3:23-cv-00770 (N.D. Cal.); Order Granting Conditional Certification, 16 May 2025 (Judge Rita Lin).</li>
        <li>Moffatt v. Air Canada, 2024 BCCRT 149 (British Columbia Civil Resolution Tribunal, February 2024).</li>
        <li>Italian Garante per la Protezione dei Dati Personali, <em>Provvedimento against OpenAI</em>, 20 December 2024; €15 million fine.</li>
        <li>Wong, A., Otles, E., Donnelly, J. P., et al., "External Validation of a Widely Implemented Proprietary Sepsis Prediction Model in Hospitalized Patients," <em>JAMA Internal Medicine</em>, 181(8): 1065 to 1070 (2021).</li>
        <li>McKinsey &amp; Company, <em>The State of AI in early 2024</em> and <em>State of AI 2025</em> surveys.</li>
        <li>Deloitte, <em>State of Generative AI in the Enterprise</em>, Q4 2024 / Q1 2025.</li>
        <li>National Association of Corporate Directors, <em>2024 Public Company Governance Survey</em>.</li>
        <li>PwC, <em>Annual Corporate Directors Survey 2024</em>.</li>
        <li>Microsoft and LinkedIn, <em>2024 Work Trend Index Annual Report</em> (n=31,000 knowledge workers across 31 markets, fielded February to March 2024); BYOAI finding of 78 percent.</li>
        <li>Cyberhaven Labs, <em>Q2 2024 Quarterly Report on Generative AI in the Workplace</em>.</li>
        <li>EEOC v. iTutorGroup, Inc., settlement August 2023 (USD 365,000).</li>
        <li>Dutch Data Protection Authority decisions against Belastingdienst (Tax Administration), December 2021 and April 2022; toeslagenaffaire (childcare benefits scandal) compensation programme summary, Government of the Netherlands.</li>
        <li>Post Office Horizon IT Inquiry, ongoing 2025 and 2026; <em>Bates and Others v. Post Office Ltd</em>, Common Issues Judgment [2019] EWHC 606 (QB).</li>
        <li>Financial Conduct Authority, Bank of England, and Prudential Regulation Authority, <em>AI Update</em> and joint statement, 22 April 2024; <em>Artificial Intelligence in UK Financial Services</em>, BoE/FCA survey, 2024.</li>
        <li>Colorado SB24-205 (Consumer Protections for Artificial Intelligence), as amended by SB25B-004; effective 30 June 2026.</li>
        <li>ICAO, <em>Annex 19: Safety Management</em>; Doc 9859 <em>Safety Management Manual</em> (4th ed.).</li>
        <li>Consumer Financial Protection Bureau, Circular 2023-03 (Adverse Action Notification Requirements).</li>
      </ol>

      <SectionDivider label="About the author" />

      <P>
        Adam Field is the founder of Crox, a UK consultancy supporting AI adoption in regulated industries. <a href="/" className="text-accent no-underline hover:text-fg transition-colors">Crox.io</a>.
      </P>

      <P>
        If this briefing was useful, it is also free to forward. The intended audience is non-executive directors, audit committee chairs, general counsel, and chief risk officers in any organisation under sector-specific regulation. Comments and corrections to <a href="mailto:adam@crox.io" className="text-accent no-underline hover:text-fg transition-colors">adam@crox.io</a> are welcome.
      </P>
    </div>
  );
};
