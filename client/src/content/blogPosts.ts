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
    slug: 'connect-ai-to-business-tools',
    title: 'How to Connect AI to Your Business Tools Without Writing Code',
    subtitle: 'A step-by-step guide to linking ChatGPT, Claude, and Copilot to your CRM, accounting software, and project management tools using Model Context Protocol.',
    date: 'March 2026',
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
    date: 'March 2026',
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
    date: 'March 2026',
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
    date: 'March 2026',
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
    readTime: '8 min read',
    description:
      'How UK legal practices are safely using AI for document review, legal research, and client intake while staying compliant with SRA regulations and GDPR.',
    keywords: ['ai for solicitors uk', 'legal ai tools compliant', 'ai document review law firm', 'sra compliant ai', 'ai for legal practices gdpr', 'automate legal admin with ai'],
    tags: ['Legal Tech', 'Compliance', 'SRA', 'GDPR'],
  },
];

export const getBlogPostBySlug = (slug: string): BlogPost | undefined => {
  return blogPosts.find((post) => post.slug === slug);
};
