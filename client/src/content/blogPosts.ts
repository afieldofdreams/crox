export interface BlogPost {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  readTime: string;
  description: string;
  keywords: string[];
  tags: string[];
  dateISO?: string;
}

export const blogPosts: BlogPost[] = [
  {
    slug: 'ai-for-gp-practices',
    title: 'AI for GP Practices: The Document Mountain, DNAs, and the Lines Not to Cross',
    subtitle: 'Document workflow, recalls, and care navigation support — where AI genuinely helps general practice, inside NHS information governance rather than around it.',
    date: 'August 2026',
    dateISO: '2026-08-08',
    readTime: '6 min read',
    description:
      'Where AI actually helps a UK GP practice — incoming document workflow, DNA reduction and QOF recalls, care navigation support, practice admin — and the governance lines: DPIAs, ambient scribes, and keeping clinical judgement human.',
    keywords: ['ai for gp practices', 'ai general practice uk', 'ai document workflow gp', 'ai nhs primary care', 'gp practice automation', 'ai patient recalls', 'ambient scribe gp', 'practice manager ai'],
    tags: ['General Practice', 'Healthcare', 'AI Automation', 'NHS'],
  },
  {
    slug: 'ai-for-logistics-haulage',
    title: 'AI for Logistics and Haulage: PODs, Chasers, and Cash Flow',
    subtitle: 'POD chasing, invoice matching, status queries, and load quoting — the transport office is one of the best-fit environments for AI there is.',
    date: 'August 2026',
    dateISO: '2026-08-08',
    readTime: '5 min read',
    description:
      'What AI does well in a UK haulage or logistics firm — POD chasing and invoicing, answering delivery status queries from the TMS, quoting loads, driver document compliance — with honest costs and the right first process.',
    keywords: ['ai for logistics', 'ai haulage uk', 'pod chasing automation', 'transport office automation', 'ai freight quoting', 'tms ai integration', 'ai for transport companies', 'logistics invoicing automation'],
    tags: ['Logistics', 'Haulage', 'AI Automation', 'SME'],
  },
  {
    slug: 'ai-for-hospitality',
    title: 'AI for Hospitality: Win the Function Enquiry, Answer Every Review',
    subtitle: 'Event enquiries answered at midnight, reviews replied to in your voice, allergen paperwork that keeps itself current — where AI pays back in restaurants, hotels, and venues.',
    date: 'August 2026',
    dateISO: '2026-08-08',
    readTime: '5 min read',
    description:
      'Where AI genuinely helps UK hospitality businesses — function and event enquiry handling, guest FAQs, review responses, rotas, supplier and food-safety admin — with realistic costs and what to automate first.',
    keywords: ['ai for hospitality', 'ai for restaurants uk', 'ai for hotels', 'ai review responses', 'event enquiry automation', 'ai guest communication', 'restaurant admin automation', 'hotel direct bookings ai'],
    tags: ['Hospitality', 'AI Automation', 'SME', 'Customer Experience'],
  },
  {
    slug: 'ai-for-architects',
    title: 'AI for Architects: Fee Proposals, Planning Packs, and the Drawing Line',
    subtitle: 'The written layer of practice — proposals, planning documents, minutes, RFIs — automates well. The architecture stays yours, and the profession\'s rules make the boundary easy.',
    date: 'August 2026',
    dateISO: '2026-08-08',
    readTime: '6 min read',
    description:
      'Where AI helps a UK architecture practice — fee proposals from precedents, Design and Access statement drafting, same-day minutes, RFI responses, practice admin — and the professional boundaries: design judgement, ARB accountability, PII.',
    keywords: ['ai for architects', 'ai architecture practice', 'ai fee proposals', 'design and access statement ai', 'ai planning documents', 'architect admin automation', 'riba ai guidance', 'ai for architecture firms uk'],
    tags: ['Architecture', 'AI Automation', 'SME', 'Professional Services'],
  },
  {
    slug: 'ai-for-construction-trades',
    title: 'AI for Construction Firms and Trades: Quotes, RAMS, and Getting Paid for Variations',
    subtitle: 'Faster quotes, job-specific health and safety paperwork, and site notes that become records — where AI genuinely helps a UK construction firm, and what to keep away from it.',
    date: 'August 2026',
    dateISO: '2026-08-08',
    readTime: '6 min read',
    description:
      'What AI actually does well for UK construction firms and trades — quote turnaround, RAMS and method statement drafting, variation records, subcontractor admin — with honest costs and the right first process.',
    keywords: ['ai for construction companies', 'ai for builders uk', 'ai rams generator', 'ai method statements', 'construction quoting ai', 'ai for trades', 'construction admin automation', 'ai variation records'],
    tags: ['Construction', 'AI Automation', 'SME', 'Trades'],
  },
  {
    slug: 'ai-for-manufacturers',
    title: 'AI for SME Manufacturers: Skip the Robots, Fix the Office First',
    subtitle: 'RFQs, order entry, quality paperwork, and supplier chasing — the office layer around the shop floor is where AI pays back for a 20–200 person manufacturer.',
    date: 'August 2026',
    dateISO: '2026-08-08',
    readTime: '6 min read',
    description:
      'Where AI genuinely pays back for UK SME manufacturers — quoting from RFQs, PO entry into the ERP, non-conformance and ISO documentation, supplier chasing — and why shop-floor AI can wait.',
    keywords: ['ai for manufacturers', 'ai manufacturing sme', 'ai order entry automation', 'rfq automation', 'ai quality documentation', 'erp ai integration', 'ai for factories uk', 'manufacturing admin automation'],
    tags: ['Manufacturing', 'AI Automation', 'SME', 'ERP'],
  },
  {
    slug: 'ai-for-recruitment-agencies',
    title: 'AI for Recruitment Agencies: The Wins, and the One Area the Law Watches',
    subtitle: 'Job ads, call notes, CRM hygiene, and candidate comms automate beautifully. Screening is where the EU AI Act and UK GDPR are looking — here\'s how to draw the line.',
    date: 'August 2026',
    dateISO: '2026-08-04',
    readTime: '6 min read',
    description:
      'What AI actually does well in a UK recruitment agency — job ads, interview notes, CRM hygiene, candidate communication — and why screening is legally different. Practical costs and where to start.',
    keywords: ['ai for recruitment agencies', 'ai recruitment uk', 'ai cv screening legal', 'eu ai act recruitment high risk', 'ai for recruiters', 'recruitment automation', 'ai candidate sourcing', 'bullhorn ai integration'],
    tags: ['Recruitment', 'AI Automation', 'SME', 'EU AI Act'],
  },
  {
    slug: 'ai-for-estate-agents',
    title: 'AI for Estate Agents: More Viewings, Fewer Evenings Writing Listings',
    subtitle: 'Listing copy, enquiry triage, vendor updates, and compliance checklists — where AI genuinely pays back in a UK agency branch, with honest costs.',
    date: 'August 2026',
    dateISO: '2026-08-04',
    readTime: '6 min read',
    description:
      'What AI actually does well in a UK estate agency — listing descriptions, enquiry qualification, vendor updates, AML and material information checks — plus realistic costs and the right first process.',
    keywords: ['ai for estate agents', 'ai estate agency uk', 'ai property descriptions', 'estate agent automation', 'ai lettings admin', 'property enquiry automation', 'ai for letting agents', 'estate agent crm ai'],
    tags: ['Estate Agency', 'AI Automation', 'SME', 'Property'],
  },
  {
    slug: 'ai-for-dental-practices',
    title: 'AI for Dental Practices: Filling Chairs Without Risking Records',
    subtitle: 'Recalls, letters, front-desk FAQ, and treatment plan follow-ups — the operational layer where AI pays back fast, and the governance that keeps the CQC and UK GDPR happy.',
    date: 'August 2026',
    dateISO: '2026-08-04',
    readTime: '6 min read',
    description:
      'Where AI genuinely helps a UK dental practice — recalls and reminders, treatment plan letters, front-desk questions, follow-ups — and how to handle special category data, DPIAs, and CQC accountability.',
    keywords: ['ai for dental practices', 'ai dental practice uk', 'dental practice automation', 'ai patient recalls', 'dental reception ai', 'ai healthcare admin', 'dental practice management ai', 'cqc ai governance'],
    tags: ['Dental', 'Healthcare', 'AI Automation', 'SME'],
  },
  {
    slug: 'eu-ai-act-uk-business',
    title: 'EU AI Act: Does It Apply to a UK Business?',
    subtitle: 'The Act follows the market, not the company registration. How to work out whether it reaches you before enforcement starts on 2 August 2026.',
    date: 'July 2026',
    dateISO: '2026-07-28',
    readTime: '6 min read',
    description:
      'From 2 August 2026 the bulk of the EU AI Act becomes enforceable. UK businesses are in scope when they sell AI into the EU — or when the output of an AI tool they use lands there. What that means for SMEs, and the four steps to take this week.',
    keywords: ['eu ai act uk business', 'does eu ai act apply to uk', 'eu ai act august 2026', 'ai act deployer obligations', 'ai act sme', 'uk ai regulation', 'ai governance sme', 'high risk ai systems'],
    tags: ['EU AI Act', 'AI Governance', 'Compliance', 'SME'],
  },
  {
    slug: 'second-brain-typed-entities',
    title: 'Why Fibery, Not Obsidian, for My Second Brain',
    subtitle: 'Notes on why typed entities beat flat files once the goal is thinking, not just capture.',
    date: 'May 2026',
    dateISO: '2026-05-11',
    readTime: '4 min read',
    description:
      'Obsidian thinks in notes. Fibery thinks in typed entities. Why that distinction matters once your second brain has to do real work — and once you want an AI co-pilot to read from it.',
    keywords: ['fibery vs obsidian', 'second brain', 'personal knowledge management', 'pkm', 'note-taking apps', 'typed entities', 'knowledge graph', 'ai second brain'],
    tags: ['Essay', 'Knowledge Management', 'Tools', 'AI Workflow'],
  },
  {
    slug: 'ai-vendor-dependency-risk',
    title: 'Your AI Vendor\'s Bad Day Is Your Regulatory Exposure',
    subtitle: 'On platform dependency risk in regulated AI products.',
    date: 'March 2026',
    dateISO: '2026-03-31',
    readTime: '5 min read',
    description:
      'When Anthropic exposed 512,000 lines of internal source via a public npm package, no customer data leaked — but for teams building regulated AI products, the incident reveals the risk structure they\'re standing in.',
    keywords: ['ai vendor risk', 'platform dependency', 'regulated ai', 'ai compliance', 'healthcare ai', 'ai supply chain risk', 'anthropic leak', 'ai vendor liability'],
    tags: ['Regulated AI', 'Vendor Risk', 'Compliance', 'Platform Dependency'],
  },
  {
    slug: 'static-controls-live-models',
    title: 'Static Controls, Live Models',
    subtitle: 'A briefing for boards and exec teams adopting AI in regulated industries. Free to read. No email gate. Free to forward.',
    date: 'May 2026',
    dateISO: '2026-05-05',
    readTime: '18 min read',
    description:
      'Five lenses for board-level AI governance. Why the conventional policy-and-committee playbook is structurally insufficient, what the August 2026 EU AI Act high-risk timetable actually requires, and the diagnostic question most board packs are missing: when the model your firm depends on changes silently next Thursday, what is your process?',
    keywords: ['ai board governance', 'eu ai act 2026', 'ai high risk obligations', 'board ai oversight regulated industries', 'ai supply chain risk', 'ai change detection', 'ai compliance briefing'],
    tags: ['Briefing', 'Board Governance', 'Regulated Industries', 'EU AI Act'],
  },
  {
    slug: 'connect-ai-to-business-tools',
    title: 'How to Connect AI to Your Business Tools Without Writing Code',
    subtitle: 'A step-by-step guide to linking ChatGPT, Claude, and Copilot to your CRM, accounting software, and project management tools using Model Context Protocol.',
    date: 'November 2025',
    dateISO: '2025-11-22',
    readTime: '8 min read',
    description:
      'Learn how small businesses are connecting AI assistants like ChatGPT and Claude to Xero, HubSpot, and Slack using the Model Context Protocol — no developers required.',
    keywords: ['connect chatgpt to xero', 'how to link ai to crm', 'ai integration without coding', 'connect claude to business tools', 'mcp for small business', 'ai assistant access business data'],
    tags: ['AI Integration', 'MCP', 'Small Business', 'No-Code'],
  },
  {
    slug: 'ai-for-accounting-firms',
    title: 'AI for Accounting Firms: What\'s Actually Possible in 2026',
    subtitle: 'From automated bank reconciliation to client communication — a realistic look at what AI can and can\'t do for UK accounting practices right now.',
    date: 'January 2026',
    dateISO: '2026-01-10',
    readTime: '10 min read',
    description:
      'A practical guide for UK accounting firms exploring AI automation. Covers Xero integration, automated bookkeeping, MTD compliance, and what\'s realistic in 2026.',
    keywords: ['ai for accountants uk', 'automate bookkeeping with ai', 'connect ai to xero', 'ai for small accounting firm', 'automated bank reconciliation ai', 'mtd compliance ai tools'],
    tags: ['Accounting', 'Xero', 'UK Business', 'Automation'],
  },
  {
    slug: 'why-ai-cant-see-your-crm',
    title: 'Why Your AI Assistant Can\'t See Your CRM (And How to Fix It)',
    subtitle: 'The technical gap between ChatGPT and your HubSpot, Salesforce, or Pipedrive — and the new protocol that bridges it.',
    date: 'December 2025',
    dateISO: '2025-12-12',
    readTime: '7 min read',
    description:
      'Understand why AI tools like ChatGPT can\'t access your CRM data, and how Model Context Protocol lets you securely connect AI to HubSpot, Salesforce, and Pipedrive.',
    keywords: ['why chatgpt cant access hubspot', 'connect ai to salesforce', 'ai crm integration small business', 'chatgpt hubspot integration', 'ai assistant read crm data', 'mcp crm connection'],
    tags: ['CRM', 'HubSpot', 'Salesforce', 'AI Integration'],
  },
  {
    slug: 'ai-saving-small-business-time',
    title: '5 Ways Small Businesses Are Using AI to Save 10+ Hours a Week',
    subtitle: 'Real examples from UK businesses that connected AI to their tools — and the hours they got back.',
    date: 'February 2026',
    dateISO: '2026-02-06',
    readTime: '9 min read',
    description:
      'Real examples of how UK small businesses save 10+ hours per week by connecting AI to their accounting, CRM, and project management tools via Model Context Protocol.',
    keywords: ['ai automation small business uk', 'save time with ai tools', 'ai for sme uk', 'small business ai use cases', 'how businesses use chatgpt to save time', 'ai productivity small company'],
    tags: ['Case Studies', 'Productivity', 'UK Business', 'Automation'],
  },
  {
    slug: 'ai-for-legal-practices',
    title: 'AI for UK Legal Practices: Automation That Stays Compliant',
    subtitle: 'How solicitors and legal firms are using AI for document review, research, and client intake — within SRA and GDPR boundaries.',
    date: 'March 2026',
    dateISO: '2026-03-04',
    readTime: '8 min read',
    description:
      'How UK legal practices are safely using AI for document review, legal research, and client intake while staying compliant with SRA regulations and GDPR.',
    keywords: ['ai for solicitors uk', 'legal ai tools compliant', 'ai document review law firm', 'sra compliant ai', 'ai for legal practices gdpr', 'automate legal admin with ai'],
    tags: ['Legal Tech', 'Compliance', 'SRA', 'GDPR'],
  },
  {
    slug: 'dodar-structured-reasoning-benchmark',
    title: 'We Gave Cheap AI Models a Pilot\'s Decision Framework. They Outperformed the Best.',
    subtitle: 'How the DODAR structured reasoning pipeline enables small language models to match or exceed frontier model quality at 89% lower cost.',
    date: 'March 2026',
    dateISO: '2026-03-24',
    readTime: '10 min read',
    description:
      'Our benchmark of 8 LLMs shows that structured reasoning scaffolding (DODAR pipeline) enables GPT-4.1 Mini to score 104% of Claude Opus zero-shot quality at a fraction of the cost.',
    keywords: ['dodar framework ai', 'structured reasoning llm', 'ai benchmark 2026', 'cheap ai models better results', 'llm pipeline architecture', 'ai decision making framework'],
    tags: ['Research', 'AI Architecture', 'Benchmarking', 'DODAR'],
  },
  {
    slug: 'dodar-reasoning-structure-failure',
    title: 'Benchmark Study: Does Reasoning Structure Shape Failure, Not Just Accuracy?',
    subtitle: '1,500 benchmark tests show DODAR-based prompting doesn\'t improve accuracy — but it measurably changes how models fail (p = 0.0003).',
    date: 'March 2026',
    dateISO: '2026-03-30',
    readTime: '8 min read',
    description:
      'We ran 1,500 benchmark tests on GPT-4.1-mini to test whether DODAR-based prompting improves LLM reasoning. Accuracy is flat, but error distributions are significantly different — structured phases create anchoring traps.',
    keywords: ['dodar benchmark study', 'llm reasoning structure', 'ai error analysis', 'phase-gated reasoning', 'llm anchoring bias', 'structured prompting benchmark'],
    tags: ['Research', 'AI Architecture', 'Benchmarking', 'DODAR'],
  },
];

export const getBlogPostBySlug = (slug: string): BlogPost | undefined => {
  return blogPosts.find((post) => post.slug === slug);
};
