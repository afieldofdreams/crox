import React from 'react';
import { Link } from 'react-router-dom';

export const AiCrmPost: React.FC = () => {
  return (
    <div className="space-y-6">
      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        You've probably asked an AI assistant about one of your customers and gotten a blank stare. You ask, "Tell me about Acme Corporation's history with us" and the AI says it doesn't have access to that data. Of course it doesn't. Your CRM is sitting on your server. The AI has no way to reach it.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        This isn't a limitation of the AI. It's a technical barrier. And for years, breaking through that barrier meant hiring a developer or accepting that your AI would always be disconnected from your real customer data. But that's changing. Model Context Protocol is solving this problem in a way that's practical for non-technical teams.
      </p>

      <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim my-12 flex items-center gap-4">
        Why your CRM is invisible to AI
        <span className="flex-1 h-px bg-border" />
      </div>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        Here's the technical reality. AI systems like ChatGPT or Claude are text-based. They work with information that's given to them directly in a conversation. They can't browse your network. They can't log into your software. They can't query your database.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        Your CRM—whether it's HubSpot, Salesforce, Pipedrive, or something else—is secured behind authentication. Only authorized users with the right credentials can access it. The AI doesn't have credentials. Even if it did, asking every CRM vendor to build custom AI integrations would be chaotic and expensive.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        So the system stays isolated. You use your CRM for customer data, deals, and history. You ask the AI questions separately. The two never talk. And this kills a huge range of possibilities. Your AI could draft a personalized email to a customer, but it doesn't know their purchase history. It could analyze sales patterns, but it doesn't have access to your actual deals.
      </p>

      <blockquote className="border-l-2 border-accent pl-6 my-8 text-fg italic font-serif text-[1.1rem]">
        The AI isn't being stubborn. It's being secure. It just doesn't know how to talk to your CRM safely.
      </blockquote>

      <h2 className="font-serif font-normal text-[1.6rem] mb-4 mt-8">
        What Model Context Protocol changes
      </h2>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        MCP creates a secure channel between your CRM and your AI assistant. Think of it as a translator that speaks both languages.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        Here's how it works. First, you set up an MCP server specifically for your CRM. This server has credentials to access your CRM. You define exactly what permissions it has—maybe it can read customer records and deal information, but can't delete anything or modify customer data. You decide the boundaries.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        Second, you connect your AI assistant to this MCP server. Now the AI can ask the server questions like "Show me all deals in the pipeline for customer X" or "What's the history of interactions with this account." The server translates that request, queries your CRM safely using its authorized credentials, and returns the data to the AI.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        Third, every single interaction is logged. You can see exactly what data the AI requested and when. This means you have complete visibility and control.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        The critical difference from the past: you don't need custom development for every CRM. MCP is a standard. As long as your CRM has an API—which all modern ones do—you can set this up.
      </p>

      <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim my-12 flex items-center gap-4">
        Practical scenarios
        <span className="flex-1 h-px bg-border" />
      </div>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        Let's make this concrete. Say you run a SaaS company with 15 salespeople and use Pipedrive as your CRM. Your sales process requires personalized outreach, but most of your team spends time manually pulling customer history before they can send a relevant email.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        With MCP connected, a salesperson can say to an AI assistant: "Draft a follow-up email to Sarah Chen. Review her purchase history and our last three interactions before you write it." The AI reads her profile, deal history, and interaction notes from Pipedrive through the MCP server. It drafts an email that references her specific situation, recent wins, or concerns. The salesperson reviews it and sends it. No context switching. No manual data gathering.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        Or consider a customer success scenario. You have a support team using HubSpot to track customer issues. When a ticket comes in, an agent could ask the AI: "Tell me what happened with this customer's onboarding" or "Why did they originally buy from us?" The AI fetches the history and gives the agent the full context in seconds. The resolution is faster and more thoughtful because the agent has the facts.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        For account-based marketing, it's even more powerful. Your AI can analyze all deals in a specific sector, identify buying patterns, and suggest which accounts to target next. It can review past campaigns to a client and suggest what messaging worked. This isn't guessing. It's data-driven recommendations from your actual history.
      </p>

      <h2 className="font-serif font-normal text-[1.6rem] mb-4 mt-8">
        The security reality
      </h2>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        The first objection we hear is always security. "Are you exposing my CRM by connecting it to an AI?" The answer is no, for a specific reason.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        With MCP, the data flow is controlled and limited. The AI doesn't get a login to your CRM. It doesn't get a master API key. It gets a request-response channel with defined permissions. You're not broadcasting your CRM on the internet. You're creating a one-way reading relationship where specific data can flow from your system to the AI when authorized.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        The second piece is auditability. Everything is logged. If you need to investigate whether the AI accessed sensitive information, you have the full record. If you need to prove compliance, the logs are there. If a team member is concerned about data leakage, you can show them exactly what data moved and when.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        And the permissions are granular. You're not saying "let the AI see everything." You're saying "let the AI read customer names, company size, and recent deals, but not pricing or contract terms." You control the scope down to the field level.
      </p>

      <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim my-12 flex items-center gap-4">
        Why it matters that this is a standard
        <span className="flex-1 h-px bg-border" />
      </div>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        The reason MCP is actually changing things—not just theoretically, but practically—is that it's a standard. This means it doesn't matter if you use HubSpot, Salesforce, Pipedrive, or Zoho. The MCP server pattern is the same.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        For the first time, connecting an AI to your CRM doesn't require a custom integration. You're not waiting for HubSpot to build an AI integration. You're not paying a developer tens of thousands of pounds to build a bridge. You're using a standard pattern that any developer, or even a knowledgeable non-technical person, can set up.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        This is huge for businesses of all sizes. Enterprises that could afford custom development could always do this. But now a 10-person agency, a 20-person consultancy, a growing SaaS team—they can all connect their CRM to AI. The cost dropped from five figures to low four figures. The timeline dropped from three months to three weeks.
      </p>

      <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim my-12 flex items-center gap-4">
        Getting started
        <span className="flex-1 h-px bg-border" />
      </div>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        If you're running a business with a CRM and you've been frustrated that your AI assistant can't see your data, the solution is within reach. Start by understanding what specific workflows would change if the AI had CRM access.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        Maybe it's sales outreach. Maybe it's customer success. Maybe it's marketing analysis. Pick one. Define what data the AI needs to see. Define what actions, if any, it should be allowed to take. Then set up the MCP connection with clear permissions.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        <Link to="/ai-integration" className="text-fg border-b border-border pb-px hover:border-accent transition-colors">
          Discuss your CRM integration with our team
        </Link>
        {' '}to understand what's possible, what's safe, and what the actual workflow changes would be for your organization. We'll map out the specific data your AI needs and design the MCP connection with the right boundaries.
      </p>
    </div>
  );
};
