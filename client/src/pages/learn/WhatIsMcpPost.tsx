import React from "react";

const WhatIsMcpPost: React.FC = () => {
  return (
    <article className="prose prose-invert max-w-none">
      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        The Model Context Protocol (MCP) is an open standard that enables AI systems to safely connect to your business tools, databases, and services. Think of it as a secure translation layer between AI assistants and the applications you already use—enabling them to access information and take actions without requiring direct access to your data.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        If you've used ChatGPT with plugins, or Claude with connected tools, you've benefited from MCP-like functionality. What makes MCP different is that it's an open standard—not proprietary to any single AI provider. This means once your tools support MCP, any compatible AI system can use them.
      </p>

      {/* Section Divider */}
      <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim my-12 flex items-center gap-4">
        The Problem MCP Solves
        <span className="flex-1 h-px bg-border" />
      </div>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        Consider how most businesses connect software today. Your CRM holds customer data. Your accounting software tracks finances. Your project management tool organizes work. But these systems don't talk to each other easily. When you need information across tools, someone has to manually pull it together.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        AI assistants face the same problem. Give ChatGPT access to your Salesforce instance, and it could theoretically answer customer questions. But there's no standard way for it to authenticate, discover what it's allowed to do, or understand what data it can access. Building custom integrations for each AI tool is expensive and fragile.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        MCP solves this by defining a <span className="text-fg">standard interface</span> that any AI system can use to connect to any business application. It's like defining a universal power outlet—once you have one, devices from any manufacturer can plug in.
      </p>

      {/* Section Divider */}
      <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim my-12 flex items-center gap-4">
        How MCP Works
        <span className="flex-1 h-px bg-border" />
      </div>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        At its core, MCP is a <span className="text-fg">request-response protocol</span>. The AI system makes requests to a server (your application or a service), and the server responds with data or confirms actions. Here's the basic flow:
      </p>

      <div className="bg-surface border border-border p-6 my-8 font-mono text-[0.85rem] text-fg-dim leading-[1.8]">
        <div className="mb-2">AI: "Show me all open customer tickets"</div>
        <div className="mb-2">↓</div>
        <div className="mb-2">MCP Server: (checks authentication, validates request)</div>
        <div className="mb-2">↓</div>
        <div className="mb-2">MCP Server: "You have 12 open tickets. Here are details..."</div>
        <div className="mb-2">↓</div>
        <div>AI: (processes response and uses it in conversation)</div>
      </div>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        The key innovation is that <em className="text-accent">the protocol is standardized, but the implementation is flexible</em>. Your Salesforce instance can expose its data through MCP in one way, while your Slack workspace exposes team communication in another way. The AI doesn't care about these differences—it speaks MCP to all of them.
      </p>

      <h2 className="font-serif font-normal text-[1.6rem] mb-4 mt-8 text-fg">
        Core MCP Concepts
      </h2>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        <span className="text-fg">Resources:</span> These are the actual data your tools expose. A Salesforce resource might be a customer record. A Google Sheets resource might be a specific spreadsheet. Resources have types, are accessed by unique identifiers, and can be read or modified depending on permissions.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        <span className="text-fg">Tools:</span> These are actions the AI can perform. An MCP tool might be "create a new ticket" or "send a message" or "update a record." Tools can accept parameters and return results. They're how the AI moves from reading information to taking action.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        <span className="text-fg">Prompts:</span> Think of these as templates that help the AI interact with your system effectively. A prompt might provide context about your business, explain common use cases, or guide the AI toward useful actions. Good prompts make AI assistants more valuable to your organization.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        <span className="text-fg">Sampling:</span> MCP includes a built-in sampling mechanism so you can understand how the AI is using your tools. This is crucial for governance and debugging. You can see which requests were made, what data was accessed, and what actions were taken.
      </p>

      {/* Section Divider */}
      <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim my-12 flex items-center gap-4">
        Why MCP Matters to Businesses
        <span className="flex-1 h-px bg-border" />
      </div>

      <blockquote className="border-l-2 border-accent pl-6 my-8 text-fg italic font-serif text-[1.1rem]">
        MCP is the bridge between a world where AI has general intelligence, and a world where AI has access to your specific business context.
      </blockquote>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        Most AI systems today are trained on public internet data. They're good at general tasks but ignorant about your specific business, customers, and processes. An AI that can read your CRM data, project plans, and customer communication becomes vastly more valuable—but only if you can connect it safely.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        MCP enables this safely. You control exactly what data is exposed, what actions are allowed, and how access is audited. The AI vendor never sees your data directly—it only interacts through the MCP interface you've defined.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        This matters for several reasons. First, <span className="text-fg">security</span>. Your Salesforce password never leaves your network. Second, <span className="text-fg">compliance</span>. You maintain control over data access and can audit what the AI accessed. Third, <span className="text-fg">vendor independence</span>. Once your tools support MCP, you're not locked into one AI provider—you can switch or use multiple providers simultaneously.
      </p>

      {/* Section Divider */}
      <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim my-12 flex items-center gap-4">
        The Practical Reality
        <span className="flex-1 h-px bg-border" />
      </div>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        MCP is still young. Most mainstream business applications haven't built MCP servers yet. This is where integration partners like Crox come in. We can build MCP servers for your existing tools, or handle the entire process of connecting your infrastructure to AI systems.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        The protocol itself is surprisingly simple—it's built on JSON and standard web technologies. What's complex is understanding your business processes, designing the right resources and tools to expose, and implementing it reliably in production. That's where expertise matters.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        As AI becomes more integrated into business operations, MCP will likely become as fundamental as APIs are today. The teams that understand this standard now and implement it thoughtfully will have a significant advantage in deploying AI effectively across their organizations.
      </p>
    </article>
  );
};

export default WhatIsMcpPost;
