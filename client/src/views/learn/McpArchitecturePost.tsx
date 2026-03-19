import React from "react";

const McpArchitecturePost: React.FC = () => {
  return (
    <article className="prose prose-invert max-w-none">
      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        If you want to understand how MCP actually works—how requests flow from an AI system to your business tools and back—this is the deep dive. We'll walk through the architecture from the ground up, explain each component, and show you how data and actions move through the system.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        You don't need to be a developer to understand this, but you do need to be comfortable with technical concepts. Think of this as understanding the internal design of something you're about to adopt.
      </p>

      {/* Section Divider */}
      <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim my-12 flex items-center gap-4">
        The Three-Part Architecture
        <span className="flex-1 h-px bg-border" />
      </div>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        MCP has three fundamental layers: the client, the communication layer, and the server. Let's start by understanding what each does.
      </p>

      <h2 className="font-serif font-normal text-[1.6rem] mb-4 mt-8 text-fg">
        The MCP Client
      </h2>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        The client is the AI system—Claude, ChatGPT, or whatever LLM is powering your interaction. The client needs something, so it formulates a request. But here's the key: the client doesn't build the request itself. Instead, it works with what we call a <span className="text-fg">client runtime</span>.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        Think of the runtime as a translator and conductor. The AI knows it wants to "find a customer named Alice," but it doesn't know how to phrase that request in a way the server understands. The runtime bridges that gap. It also manages the conversation itself—maintaining state, handling retries, and ensuring things stay organized.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        In practical terms, if you're using Claude through Cursor or another IDE, the IDE has a client runtime built in. If you're building a custom application, you'd implement your own client runtime using an MCP library.
      </p>

      <h2 className="font-serif font-normal text-[1.6rem] mb-4 mt-8 text-fg">
        The Communication Layer
      </h2>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        The client and server need to talk to each other. MCP is transport-agnostic, meaning it doesn't care <em className="text-accent">how</em> the messages travel—just that they arrive correctly. In practice, this is usually JSON-RPC over HTTP, WebSocket, or stdio (for local integrations).
      </p>

      <div className="bg-surface border border-border p-6 my-8 font-mono text-[0.85rem] text-fg-dim leading-[1.8]">
        <div>Request (JSON-RPC):</div>
        <div className="mt-3 text-accent">{"{"}</div>
        <div>  "jsonrpc": "2.0",</div>
        <div>  "id": 1,</div>
        <div>  "method": "resources/read",</div>
        <div>  "params": {"{"} "uri": "salesforce://customers/alice" {"}"}</div>
        <div className="text-accent">{"}"}</div>
      </div>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        The message is standardized. It has an ID so responses can be matched to requests. It specifies a method (what to do) and parameters (what to do it with). The server reads this, processes it, and sends back a response in the same format.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        This standardization is crucial. The AI vendor doesn't care about your business logic. Your systems don't care about the AI vendor's internals. They just exchange JSON messages. Both sides understand the contract.
      </p>

      <h2 className="font-serif font-normal text-[1.6rem] mb-4 mt-8 text-fg">
        The MCP Server
      </h2>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        The server is where your business logic lives. This is custom code that understands your Salesforce instance, your database schema, your authentication, your business rules.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        An MCP server accepts requests in the standard format, validates them, executes the appropriate action in your systems, and returns a response. If the client asks to read a customer record, the server fetches it from your database. If the client asks to create an order, the server validates the request and updates your order management system.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        The server is also where you implement security. It authenticates requests, enforces authorization rules, audits what was accessed, and ensures data isn't leaked to unauthorized parties. You might expose a "read customers" resource to some clients but not others. You might allow "create orders" for certain AI assistants but restrict "delete orders" entirely.
      </p>

      {/* Section Divider */}
      <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim my-12 flex items-center gap-4">
        How a Request Flows Through the System
        <span className="flex-1 h-px bg-border" />
      </div>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        Let's walk through a concrete example. You're using Claude to manage customer interactions. You ask: "What are our top three customers by revenue?"
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        <span className="text-fg">Step 1: The client decides it needs data.</span> Claude's internal process recognizes that it needs customer revenue information to answer your question. It knows this is something an MCP server can provide.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        <span className="text-fg">Step 2: The client runtime builds a request.</span> The runtime translates Claude's intent into an MCP request. It specifies the method (<code className="font-mono text-accent text-[0.85rem] bg-surface px-2 py-0.5">resources/list</code>), the resource type (customers), and any filters or parameters.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        <span className="text-fg">Step 3: The message is transmitted.</span> The request travels over the communication channel (likely HTTPS) to your MCP server, which is running in your infrastructure.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        <span className="text-fg">Step 4: The server authenticates and validates.</span> Your server receives the request. It checks: Is the client authorized? Is the request well-formed? Does the requested resource exist? Does the requestor have permission to access it?
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        <span className="text-fg">Step 5: The server executes.</span> If validation passes, your code runs. This might mean querying your database, calling an internal API, checking business rules, or performing some computation. In this case, it queries your CRM for customer revenue data.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        <span className="text-fg">Step 6: The server responds.</span> The data is formatted in the MCP response format and sent back to the client runtime. This response includes the data (the three top customers and their revenue), metadata (how many total results there were), and any error messages if something went wrong.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        <span className="text-fg">Step 7: Claude uses the data.</span> The client runtime unpacks the response and feeds the customer data back to Claude as context. Claude now knows your top three customers and can summarize them for you.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        <span className="text-fg">Step 8: Logging and sampling.</span> Throughout this process, the server logs what happened. This gives you an audit trail—you can see that Claude requested customer data, exactly which fields were returned, and when.
      </p>

      {/* Section Divider */}
      <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim my-12 flex items-center gap-4">
        Resources, Tools, and Prompts
        <span className="flex-1 h-px bg-border" />
      </div>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        Now let's talk about what you actually expose through MCP. There are three kinds of things:
      </p>

      <h2 className="font-serif font-normal text-[1.6rem] mb-4 mt-8 text-fg">
        Resources
      </h2>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        Resources are data. Think of them as nouns in your system: customers, orders, invoices, spreadsheets, documents. Each resource has a unique identifier (URI), a type, and a schema that defines what fields it contains.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        When you design your MCP server, you define which resources are available. You might expose <code className="font-mono text-accent text-[0.85rem] bg-surface px-2 py-0.5">salesforce://customers/*</code> (all customer records) but not <code className="font-mono text-accent text-[0.85rem] bg-surface px-2 py-0.5">salesforce://salaries/*</code> (sensitive compensation data). You control the surface area.
      </p>

      <h2 className="font-serif font-normal text-[1.6rem] mb-4 mt-8 text-fg">
        Tools
      </h2>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        Tools are actions. They're the verbs: create, update, delete, send, generate. Each tool has a name, a description, and a schema defining what parameters it accepts and what it returns.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        You might define a tool called <code className="font-mono text-accent text-[0.85rem] bg-surface px-2 py-0.5">create_customer</code> that accepts name, email, and phone number. You might define another tool called <code className="font-mono text-accent text-[0.85rem] bg-surface px-2 py-0.5">send_email</code> that takes a recipient and message body. The AI learns about these tools and can call them when appropriate.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        Tools are where you need to be most careful about security. You might allow the AI to read customer data but not delete it. You might allow creating orders but require human approval for orders above a certain value. Authorization happens at the tool level.
      </p>

      <h2 className="font-serif font-normal text-[1.6rem] mb-4 mt-8 text-fg">
        Prompts
      </h2>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        Prompts are instructions or templates that guide how the AI should use your resources and tools. They're metadata about how your business works and what the AI should care about.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        A prompt might say: "When a customer asks about their order status, always check the orders resource first. Never promise delivery dates without checking inventory." Or: "Our company has a policy that customers above $100k annual revenue get priority support. Use this when deciding response urgency."
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        Prompts give you a way to inject business logic and policy into the AI's decision-making without needing to change the underlying model.
      </p>

      {/* Section Divider */}
      <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim my-12 flex items-center gap-4">
        Security and Sampling
        <span className="flex-1 h-px bg-border" />
      </div>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        One of MCP's most important features is its built-in sampling mechanism. Every resource read and tool call is automatically logged and can be sampled. This means you can see exactly what Claude accessed and what it did.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        You can configure sampling policies. You might sample 100% of sensitive operations (like deletions) and 1% of routine reads (like viewing customer names). You can set up alerts: "If the AI accesses compensation data, notify compliance immediately."
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        This is critical for compliance and governance. If your industry has audit requirements, you can prove exactly what information the AI accessed and when. If something goes wrong, you have a complete trail.
      </p>

      <blockquote className="border-l-2 border-accent pl-6 my-8 text-fg italic font-serif text-[1.1rem]">
        MCP's sampling turns AI integration from "trust and hope for the best" into "verify and audit everything."
      </blockquote>

      {/* Section Divider */}
      <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim my-12 flex items-center gap-4">
        Implementation Patterns
        <span className="flex-1 h-px bg-border" />
      </div>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        How you actually build an MCP server depends on your existing infrastructure. There are several patterns:
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        <span className="text-fg">API wrapper:</span> If you already have REST APIs for your internal systems, you can build an MCP server that wraps those APIs. The server translates MCP requests into API calls, handles responses, and formats them back as MCP responses. This is the fastest path if your APIs already exist.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        <span className="text-fg">Database connector:</span> If you want direct MCP access to a database, you can build a server that speaks directly to your database. This is common for exposing a specific dataset that multiple AI systems need to access. The server validates queries, enforces row-level security, and returns filtered results.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        <span className="text-fg">Proxy gateway:</span> Larger organizations might build a central MCP gateway that handles authentication, rate limiting, and routing. All MCP requests flow through this gateway, which dispatches them to the appropriate internal service.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        <span className="text-fg">Adapter layer:</span> If you use platforms like Salesforce or HubSpot that have APIs but aren't MCP-native, you build an adapter that translates between their API and MCP. This is where specialized service providers add the most value.
      </p>

      {/* Section Divider */}
      <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim my-12 flex items-center gap-4">
        Why This Architecture Matters
        <span className="flex-1 h-px bg-border" />
      </div>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        Understanding MCP's architecture helps you make better decisions about adoption. You can see why vendor independence matters—because once you've built an MCP server, any AI client that speaks MCP can use it. You can understand why security is handled well—because every interaction is logged and controllable at the server level.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
        You can also see where complexity lives. The server-side implementation is custom to your business. That's not a weakness—it's actually where the value is. Generic AI systems become powerful when they're connected to your specific data and processes. Building that connection well requires understanding your business, not just following a template.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        This is exactly what we do at Crox. We translate your business logic into MCP servers, build the adapters that connect your systems, and implement the security and governance policies that keep your data safe while letting AI systems operate effectively. Once that's in place, you can use any compatible AI system—today and in the future—without rewriting anything.
      </p>
    </article>
  );
};

export default McpArchitecturePost;
