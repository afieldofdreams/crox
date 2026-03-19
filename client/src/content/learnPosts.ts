export interface LearnPost {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  readTime: string;
  description: string;
  keywords: string[];
  tags: string[];
}

export const learnPosts: LearnPost[] = [
  {
    slug: "what-is-mcp",
    title: "What Is the Model Context Protocol? A Plain English Guide",
    subtitle: "The open standard that lets AI assistants like ChatGPT and Claude securely talk to your business software — explained without jargon.",
    date: "2026-03-15",
    readTime: "6 min read",
    description: "Model Context Protocol (MCP) explained in plain English. Learn how this open standard lets AI assistants connect to your CRM, accounting tools, and databases securely.",
    keywords: ["what is model context protocol", "mcp explained simply", "model context protocol for business", "how does mcp work", "mcp anthropic explained", "ai connection protocol"],
    tags: ["MCP", "AI Infrastructure", "Explainer"],
  },
  {
    slug: "mcp-vs-apis-vs-plugins",
    title: "MCP vs APIs vs Plugins: Which Integration Approach Should Your Business Use?",
    subtitle: "A clear comparison of the three ways to connect AI to your business tools — with guidance on when each one makes sense.",
    date: "2026-03-10",
    readTime: "8 min read",
    description: "Compare Model Context Protocol, traditional APIs, and plugin ecosystems for AI integration. Learn which approach fits your business needs, budget, and technical resources.",
    keywords: ["mcp vs api", "model context protocol vs rest api", "ai plugins vs mcp", "best way to integrate ai with business tools", "mcp or api for small business", "chatgpt plugins vs mcp servers"],
    tags: ["Integration", "APIs", "Technical Comparison", "MCP"],
  },
  {
    slug: "mcp-architecture-explained",
    title: "How AI Assistants Connect to Your Tools: MCP Architecture Explained",
    subtitle: "A visual walkthrough of clients, servers, and the communication layer that makes AI integration work — from request to response.",
    date: "2026-03-05",
    readTime: "10 min read",
    description: "Understand the technical architecture behind MCP: how AI clients communicate with MCP servers to securely access your business tools, databases, and APIs.",
    keywords: ["mcp architecture diagram", "how mcp servers work", "mcp client server explained", "model context protocol technical guide", "mcp server setup", "ai tool connection architecture"],
    tags: ["Architecture", "Technical Deep Dive", "MCP Servers"],
  },
];
