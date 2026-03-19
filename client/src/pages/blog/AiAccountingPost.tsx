import React from 'react';
import { Link } from 'react-router-dom';

export const AiAccountingPost: React.FC = () => {
  return (
    <div className="space-y-6">
      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        Every accounting firm we talk to has asked the same question: "What can AI actually do for us right now?" The answer is more than they expect, and probably different than they think.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        AI isn't going to replace accountants. But it absolutely can eliminate the tedious parts of the job—the manual data entry, the chasing of receipts, the repetitive compliance checks. And in 2026, with Model Context Protocol connecting AI to your existing systems like Xero, QuickBooks, or Sage, the practicality of this is no longer theoretical.
      </p>

      <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim my-12 flex items-center gap-4">
        Where AI is actually useful in accounting
        <span className="flex-1 h-px bg-border" />
      </div>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        Start with transaction categorization. This is pure busywork. A client sends over a CSV of transactions. Someone on your team manually checks each one, codes it correctly, and files it. An AI with access to your accounting software can read a transaction description, check historical patterns, and suggest the right category with high accuracy. For a typical firm processing hundreds of transactions monthly, this saves 10-15 hours per week.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        Bank reconciliation is another obvious candidate. Your team downloads bank statements, manually matches them to transactions in Xero or QuickBooks, and flags discrepancies. An AI connected via MCP can do this automatically. It reads the bank statement, compares it to your accounting system, identifies unmatched transactions, and flags potential errors. It can even suggest explanations for timing differences.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        Invoice management becomes dramatically simpler. When a client email arrives with a PDF invoice, an AI can extract the vendor name, invoice number, amount, and due date automatically. It can check whether this vendor already exists in your system, flag invoices from unfamiliar suppliers, and route them to the right person. For larger firms processing dozens of invoices daily, this is transformative.
      </p>

      <blockquote className="border-l-2 border-accent pl-6 my-8 text-fg italic font-serif text-[1.1rem]">
        The firms winning right now aren't using AI to do accounting better. They're using it to eliminate the parts of accounting that don't require human judgment.
      </blockquote>

      <h2 className="font-serif font-normal text-[1.6rem] mb-4 mt-8">
        Compliance and error detection
      </h2>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        Here's where AI becomes less about saving time and more about reducing risk. A well-configured AI system connected to your accounting software can monitor transactions continuously and flag potential issues before they become problems.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        Unusual transaction patterns stand out immediately. If a client typically receives £50,000 monthly in revenue but suddenly receives £500,000 in a single day, the AI flags it. If round-number transactions start appearing when they usually don't, the AI catches it. If money moves to a new bank account without documented authorization, the AI alerts your team.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        For VAT compliance, an AI can read through transactions and identify potential issues—missing VAT codes, reversed charges that don't qualify, transactions that might trigger VAT investigations. This isn't replacing your accountant's knowledge. It's giving your team a second set of eyes that never gets tired.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        The key here is that the AI stays within your systems. It doesn't send client data anywhere. It doesn't train on sensitive information. Using Model Context Protocol, it reads what it's authorized to read, performs analysis, and reports back. Everything stays secure.
      </p>

      <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim my-12 flex items-center gap-4">
        Real workflow example: month-end close
        <span className="flex-1 h-px bg-border" />
      </div>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        Here's how an accounting firm might actually use this. Let's say it's the 28th of the month and you're starting the close process for 20 clients.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        Your AI assistant, connected via MCP to Xero and your email system, automatically gathers preliminary data. It pulls the trial balance for each client. It identifies any unreconciled accounts. It extracts information from any month-end adjustment emails your team has sent. It flags transactions that look unusual or require follow-up.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        By the time your team sits down to do the actual close, 80% of the groundwork is done. The anomalies are already identified. The documentation is already gathered. Your accountants focus on the decisions and judgments that actually require their expertise.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        A month-end close that usually takes three days now takes one and a half. That's two days per month per client. For a 20-person team managing 50 clients, that's significant capacity freed up.
      </p>

      <h2 className="font-serif font-normal text-[1.6rem] mb-4 mt-8">
        Client communication and reporting
      </h2>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        Here's something less obvious: AI is phenomenal at explaining things. When you send a client a set of financial statements, they often have questions. An AI with access to their accounting data can answer those questions immediately and accurately.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        Client asks "Why are professional fees up 20% this month?" The AI reads the transactions and explains that it's because they paid their quarterly accountancy bill. Client asks "What was our best month this year?" The AI checks the records and gives them the answer with supporting data.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        More importantly, this frees your team from answering routine questions. They're not sitting on email saying "Revenue was £340,000 in February." They're focused on strategic conversations, tax planning, and business advice. The AI handles the lookups.
      </p>

      <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim my-12 flex items-center gap-4">
        The implementation question
        <span className="flex-1 h-px bg-border" />
      </div>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        The realistic conversation is this: you probably don't need to build custom AI. You need to connect an AI assistant to your existing tools. That's what MCP does. It lets you configure what data an AI can access and what actions it can take. No coding required.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        You'd start by identifying the single workflow that causes the most pain or costs the most time. Maybe it's bank reconciliation. Maybe it's invoice processing. You connect the AI to those systems with carefully defined permissions. You test it thoroughly. You train your team on how to use it. Then you expand.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        The timeline matters. You're not looking at a 12-month implementation. A well-planned MCP integration typically takes 4-6 weeks from planning to production, often with a single developer or consultant.
      </p>

      <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim my-12 flex items-center gap-4">
        What's holding firms back
        <span className="flex-1 h-px bg-border" />
      </div>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        Most of the resistance we see comes from uncertainty, not from the technology itself. "Is this secure?" "Will this break our compliance?" "Are we liable if the AI makes a mistake?" These are legitimate questions.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        The honest answer is that with MCP, security is stronger than many manual processes. The AI operates with explicit, auditable permissions. Every action is logged. Your data never leaves your systems. You maintain absolute control over what the AI can and cannot do.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        For liability, the same principle applies. The AI isn't making independent decisions. It's assisting your team. Your accountants review its work before it has any effect. You're not delegating; you're augmenting.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        The firms that are moving forward are the ones that are treating AI not as a replacement, but as infrastructure. Just like you installed accounting software to eliminate manual ledgers, you're now installing AI to eliminate tedious data work.
      </p>

      <p className="text-[0.95rem] text-fg-dim leading-[1.8]">
        <Link to="/ai-integration" className="text-fg border-b border-border pb-px hover:border-accent transition-colors">
          Talk to our team about integrating AI
        </Link>
        {' '}into your accounting practice. We can map out specifically what would work for your firm, what the timeline looks like, and what the actual time savings would be for your team.
      </p>
    </div>
  );
};
