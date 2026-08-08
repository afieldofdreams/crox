export interface LearnPost {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  dateISO: string;
  readTime: string;
  description: string;
  keywords: string[];
  tags: string[];
}

export const learnPosts: LearnPost[] = [
  {
    slug: "is-chatgpt-safe-for-business-data",
    title: "Is ChatGPT Safe for Business Data? The Honest Answer for SMEs",
    subtitle: "The tool is rarely the problem — the tier and the habits are. Where the risk actually lives, and the five rules that make AI assistants safe for company data.",
    date: "August 2026",
    dateISO: "2026-08-08",
    readTime: "6 min read",
    description: "Is it safe to put business data into ChatGPT or Claude? What business tiers change about training and retention, what UK GDPR actually requires, the five rules that manage the risk, and why shadow AI use is the bigger exposure.",
    keywords: ["is chatgpt safe for business", "chatgpt business data security", "chatgpt gdpr uk", "ai data protection business", "is claude safe for business data", "chatgpt confidential information", "ai security small business", "shadow ai risk"],
    tags: ["Security", "Data Protection", "SME", "Governance"],
  },
  {
    slug: "sme-ai-policy",
    title: "What Should an SME AI Policy Include? Seven Questions, One Page",
    subtitle: "The AI policy that works for a 10–200 person firm is a page long and answers seven questions. Here they are, with the wording that holds up.",
    date: "August 2026",
    dateISO: "2026-08-08",
    readTime: "6 min read",
    description: "How to write an AI policy for a small business: approved tools, the never-paste list, human review rules, decisions AI can't make, disclosure, incident reporting, and ownership — one page, seven sections.",
    keywords: ["ai policy small business", "ai policy template uk", "sme ai policy", "ai acceptable use policy", "company ai policy example", "ai usage policy employees", "ai governance small business", "workplace ai rules"],
    tags: ["Governance", "Policy", "SME", "Compliance"],
  },
  {
    slug: "ai-automation-cost",
    title: "How Much Does AI Automation Cost a Small Business? Real Numbers",
    subtitle: "The three tiers of AI spend — off-the-shelf tools, connected automation, and ongoing support — with actual price ranges and the arithmetic for deciding what's worth it.",
    date: "August 2026",
    dateISO: "2026-08-04",
    readTime: "7 min read",
    description: "AI automation costs for UK SMEs, with real numbers: £15–£60/user/month for assistants, £5,000–£25,000 for a connected build, and what support costs. What inflates the price and when to skip it.",
    keywords: ["how much does ai automation cost", "ai automation cost small business", "ai cost uk sme", "ai implementation cost", "custom ai automation price", "ai consultant cost uk", "mcp integration cost", "ai budget small business"],
    tags: ["Costs", "AI Automation", "SME", "Buyer's Guide"],
  },
  {
    slug: "what-is-mcp",
    title: "What Is the Model Context Protocol? A Plain English Guide",
    subtitle: "The open standard that lets AI assistants like ChatGPT and Claude securely talk to your business software — explained without jargon.",
    date: "November 2025",
    dateISO: "2025-11-18",
    readTime: "6 min read",
    description: "Model Context Protocol (MCP) explained in plain English. Learn how this open standard lets AI assistants connect to your CRM, accounting tools, and databases securely.",
    keywords: ["what is model context protocol", "mcp explained simply", "model context protocol for business", "how does mcp work", "mcp anthropic explained", "ai connection protocol"],
    tags: ["MCP", "AI Infrastructure", "Explainer"],
  },
  {
    slug: "mcp-vs-apis-vs-plugins",
    title: "MCP vs APIs vs Plugins: Which Integration Approach Should Your Business Use?",
    subtitle: "A clear comparison of the three ways to connect AI to your business tools — with guidance on when each one makes sense.",
    date: "December 2025",
    dateISO: "2025-12-05",
    readTime: "8 min read",
    description: "Compare Model Context Protocol, traditional APIs, and plugin ecosystems for AI integration. Learn which approach fits your business needs, budget, and technical resources.",
    keywords: ["mcp vs api", "model context protocol vs rest api", "ai plugins vs mcp", "best way to integrate ai with business tools", "mcp or api for small business", "chatgpt plugins vs mcp servers"],
    tags: ["Integration", "APIs", "Technical Comparison", "MCP"],
  },
  {
    slug: "mcp-architecture-explained",
    title: "How AI Assistants Connect to Your Tools: MCP Architecture Explained",
    subtitle: "A visual walkthrough of clients, servers, and the communication layer that makes AI integration work — from request to response.",
    date: "January 2026",
    dateISO: "2026-01-14",
    readTime: "10 min read",
    description: "Understand the technical architecture behind MCP: how AI clients communicate with MCP servers to securely access your business tools, databases, and APIs.",
    keywords: ["mcp architecture diagram", "how mcp servers work", "mcp client server explained", "model context protocol technical guide", "mcp server setup", "ai tool connection architecture"],
    tags: ["Architecture", "Technical Deep Dive", "MCP Servers"],
  },
  {
    slug: "where-to-start-ai-automation",
    title: "Where Should We Start With AI Automation? How to Pick the First Process",
    subtitle: "A practical guide for operational teams told to 'go do AI' — how to spot the right first process, score the candidates, and start where the risk is lowest.",
    date: "February 2026",
    dateISO: "2026-02-11",
    readTime: "8 min read",
    description: "How to choose your first AI automation project. Learn which processes make good candidates, what to avoid first, and a simple scoring exercise to shortlist where to begin.",
    keywords: ["where to start with ai automation", "first ai automation project", "how to choose a process to automate", "ai automation for operations teams", "best processes to automate with ai", "ai automation business strategy"],
    tags: ["Getting Started", "Operations", "Strategy"],
  },
  {
    slug: "ai-automation-roi",
    title: "What's the ROI of AI Automation — And How Do We Prove It?",
    subtitle: "Building the business case execs actually ask for — hard savings versus soft gains, a simple payback framework, and the ROI traps that sink credibility.",
    date: "March 2026",
    dateISO: "2026-03-18",
    readTime: "9 min read",
    description: "How to measure and prove the ROI of AI automation. Separate hard savings from soft gains, baseline before you build, model payback period, and avoid the common ROI traps.",
    keywords: ["ai automation roi", "how to measure ai roi", "business case for ai automation", "ai automation payback period", "ai cost savings calculation", "proving ai value to executives"],
    tags: ["ROI", "Business Case", "Strategy"],
  },
  {
    slug: "build-buy-or-partner-ai",
    title: "Build, Buy, or Partner? Choosing How to Add AI to Your Operations",
    subtitle: "Off-the-shelf tools, in-house development, or a specialist partner — how to decide, the total cost and lock-in trade-offs, and a clear decision checklist.",
    date: "April 2026",
    dateISO: "2026-04-15",
    readTime: "9 min read",
    description: "Build vs buy vs partner for AI automation. Understand when off-the-shelf tools are enough, when you need custom integration, the hidden costs of ownership, and how to decide.",
    keywords: ["build vs buy ai", "off the shelf ai vs custom", "ai integration build or buy", "should we build our own ai tool", "ai automation total cost of ownership", "ai vendor lock-in"],
    tags: ["Build vs Buy", "Strategy", "Integration"],
  },
  {
    slug: "ai-automation-risks-governance",
    title: "What Could Go Wrong? Governing AI Automation Without Killing It",
    subtitle: "The governance questions boards raise — data security, accuracy, human-in-the-loop, accountability — and the controls that let you move fast with your eyes open.",
    date: "May 2026",
    dateISO: "2026-05-20",
    readTime: "9 min read",
    description: "The real risks of AI automation — data exposure, hallucination, over-automation, accountability gaps — and the practical controls that govern them without slowing you down.",
    keywords: ["ai automation risks", "ai governance for business", "human in the loop ai", "ai data security", "ai accountability and audit", "safe ai adoption"],
    tags: ["Governance", "Risk", "Security"],
  },
];
