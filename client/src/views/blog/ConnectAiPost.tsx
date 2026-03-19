import React from 'react';

export const ConnectAiPost: React.FC = () => {
  return (
    <div className="space-y-6">
      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        You've probably noticed that AI assistants like ChatGPT can answer questions and write content, but they can't actually see your business data. Your CRM, accounting software, email inbox—they're all invisible to the AI. This isn't a limitation of the AI itself. It's a problem of how systems communicate with each other.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        For years, connecting different business tools meant either paying for expensive custom integrations or hiring developers. But there's a simpler path now. A new standard called Model Context Protocol (MCP) is making it possible for anyone to safely connect AI assistants to their business systems without technical expertise.
      </p>

      <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim my-12 flex items-center gap-4">
        What actually needs to happen
        <span className="flex-1 h-px bg-border" />
      </div>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        Think of connecting an AI to your business tools like building a translator. Your AI speaks one language. Your CRM, accounting software, and email all speak different languages. For them to work together, you need a translation layer in the middle.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        This translator does three critical things. First, it authenticates your AI assistant so it can prove it's allowed to access your systems. Second, it reads data from your tools and translates it into a format the AI understands. Third, it validates what the AI wants to do before executing it—so you maintain control.
      </p>

      <blockquote className="border-l-2 border-accent pl-6 my-8 text-fg italic font-serif text-[1.1rem]">
        Most businesses still think they need a developer to do this. They don't. That's what changed.
      </blockquote>

      <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim my-12 flex items-center gap-4">
        How Model Context Protocol makes this simple
        <span className="flex-1 h-px bg-border" />
      </div>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        Model Context Protocol is a standard created by Anthropic that lets business tools communicate directly with AI. It's built specifically to be straightforward for non-technical people to set up and maintain.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        Here's the practical difference. Before MCP, you'd either accept that your AI couldn't see your data, or you'd pay thousands to a developer to build a custom bridge. Now, you can use MCP to connect your AI to Xero, Shopify, HubSpot, Slack, or any other tool you use. The process is designed to be accessible, even if you've never written code.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        The connection happens through what's called a "server." This server sits between your AI and your business tools. It handles authentication using the API keys you already manage. It enforces permissions so the AI can only access what you explicitly allow. And it keeps a log of everything that happens, so you always know what the AI did and when.
      </p>

      <h2 className="font-serif font-normal text-[1.6rem] mb-4 mt-8">
        A practical example from a UK accounting firm
      </h2>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        Let's say you run a small accounting practice with 12 staff. You use Xero for accounting, HubSpot for client management, and Gmail for email. Right now, when a client calls with a question, your team has to jump between three systems to get the full picture.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        With MCP connected, you can ask an AI assistant: "Tell me about our relationship with Johnson Manufacturing—show me their last three invoices, open support tickets, and any emails from them in the last month." The AI would fetch that data through the MCP servers connected to your tools, synthesize it, and give you a complete summary. The data never leaves your systems. The AI is just reading what you've authorized it to see.
      </p>

      <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim my-12 flex items-center gap-4">
        Setting up MCP safely
        <span className="flex-1 h-px bg-border" />
      </div>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        Security is built into the process, not added afterward. When you set up an MCP connection, you choose exactly what permissions the AI receives. You're not giving it a master key to your systems. You're giving it a specific, limited key that can only do what you've defined.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        For example, you might allow the AI to read invoices from Xero, but not to create or delete them. You might allow it to read client information from HubSpot, but not to modify it. You control the boundaries. The MCP server enforces those boundaries every single time the AI tries to do something.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        Audit logs are created automatically. Every query the AI runs, every piece of data it accesses, every action it takes—it's all recorded. This means you can see exactly what happened and when, which is critical for compliance in regulated industries like accounting or legal.
      </p>

      <h2 className="font-serif font-normal text-[1.6rem] mb-4 mt-8">
        What you can build once the connection exists
      </h2>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        Once MCP is set up, the possibilities are genuinely different from what you could do before. Your AI assistant becomes not just a conversational tool, but an extension of your business operations.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        An accountant might use an AI to automatically summarize client activity, identify potential VAT issues, or flag unusual transactions. A legal practice might use it to search contracts across their system, extract relevant clauses, and check compliance against a template. A service business might have it manage scheduling, send reminders, and draft follow-up emails—all without touching your actual systems unless explicitly instructed.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        The key difference is that all of this happens with your data staying in your systems. Nothing is sent to external servers. Nothing is trained into public models. The AI is reading and working with your data safely, securely, and with full audit trails.
      </p>

      <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim my-12 flex items-center gap-4">
        The next step
        <span className="flex-1 h-px bg-border" />
      </div>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        If you're running a small or medium business and you've been waiting for AI to be truly useful with your real business data, the wait is effectively over. MCP isn't a future technology anymore. It's practical, implementable, and accessible to non-technical teams.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        The process starts by understanding what specific problems you want to solve. Do you want to reduce manual data entry? Improve client communication? Automate compliance checks? Once you know that, setting up the right MCP connections becomes straightforward.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        <a href="/ai-integration" className="text-fg border-b border-border pb-px hover:border-accent transition-colors">
          Explore our AI integration platform
        </a>
        {' '}to see how MCP can work with your specific tools and workflows. We'll help you understand what's possible, what's safe, and how to implement it without risk.
      </p>
    </div>
  );
};
