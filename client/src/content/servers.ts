export interface MCPServerEntry {
  id: string;
  name: string;
  description: string;
  category: string;
  tools: string[];
  status: 'official' | 'community' | 'custom';
  relatedBlogSlug?: string;
  relatedLearnSlug?: string;
}

export const servers: MCPServerEntry[] = [
  // Business Tools
  {
    id: 'slack-mcp',
    name: 'Slack',
    description: 'Send messages, manage channels, search conversations, and automate workflows across your Slack workspace. Let Claude read and respond to channel history.',
    category: 'Business Tools',
    tools: ['Messaging', 'Channel Management', 'Search', 'User Management'],
    status: 'official',
    relatedLearnSlug: 'mcp-slack-integration'
  },
  {
    id: 'hubspot-mcp',
    name: 'HubSpot',
    description: 'Access contacts, deals, pipelines, and customer data. Enable AI to qualify leads, update CRM records, and generate sales insights without manual data entry.',
    category: 'Business Tools',
    tools: ['CRM', 'Contacts', 'Deals', 'Analytics'],
    status: 'official',
    relatedLearnSlug: 'hubspot-crm-automation'
  },
  {
    id: 'salesforce-mcp',
    name: 'Salesforce',
    description: 'Connect to Salesforce orgs to query objects, create/update records, and execute workflows. Let AI manage opportunities, accounts, and custom objects.',
    category: 'Business Tools',
    tools: ['CRM', 'Objects', 'Workflows', 'Reports'],
    status: 'official'
  },
  {
    id: 'google-workspace-mcp',
    name: 'Google Workspace',
    description: 'Integrate with Gmail, Google Docs, Sheets, and Drive. Enable Claude to read documents, create presentations, and manage workspace data at scale.',
    category: 'Business Tools',
    tools: ['Gmail', 'Docs', 'Sheets', 'Drive', 'Slides'],
    status: 'official',
    relatedLearnSlug: 'google-workspace-automation'
  },
  {
    id: 'microsoft-365-mcp',
    name: 'Microsoft 365',
    description: 'Access Outlook, Teams, Excel, Word, and OneDrive. Automate email workflows, manage shared documents, and integrate with Azure services.',
    category: 'Business Tools',
    tools: ['Outlook', 'Teams', 'Excel', 'Word', 'OneDrive'],
    status: 'official'
  },

  // Finance & Accounting
  {
    id: 'xero-mcp',
    name: 'Xero',
    description: 'Connect to accounting data: invoices, bills, contacts, and bank transactions. Let Claude analyze financial health and automate bookkeeping tasks.',
    category: 'Finance & Accounting',
    tools: ['Invoicing', 'Bills', 'Bank Reconciliation', 'Financial Reports'],
    status: 'official'
  },
  {
    id: 'quickbooks-mcp',
    name: 'QuickBooks',
    description: 'Manage invoices, expenses, and accounts via QuickBooks API. Enable AI to extract financial data, create reports, and sync transactions.',
    category: 'Finance & Accounting',
    tools: ['Invoicing', 'Expenses', 'Reports', 'Accounts'],
    status: 'community'
  },
  {
    id: 'stripe-mcp',
    name: 'Stripe',
    description: 'Query payment events, manage customers, retrieve invoices, and analyze payment data. Let Claude understand transaction patterns and refund requests.',
    category: 'Finance & Accounting',
    tools: ['Payments', 'Invoices', 'Customers', 'Transactions'],
    status: 'official',
    relatedLearnSlug: 'stripe-payment-automation'
  },

  // Development
  {
    id: 'github-mcp',
    name: 'GitHub',
    description: 'Search repos, read code, create issues, manage PRs, and trigger workflows. Let Claude understand codebases and contribute to development cycles.',
    category: 'Development',
    tools: ['Repos', 'Issues', 'Pull Requests', 'Actions', 'Code Search'],
    status: 'official',
    relatedLearnSlug: 'github-integration-mcp'
  },
  {
    id: 'gitlab-mcp',
    name: 'GitLab',
    description: 'Integrate with GitLab instances to manage projects, merge requests, CI/CD pipelines, and repository data.',
    category: 'Development',
    tools: ['Projects', 'Merge Requests', 'CI/CD', 'Repository'],
    status: 'community'
  },
  {
    id: 'linear-mcp',
    name: 'Linear',
    description: 'Connect to Linear workspaces to create issues, update projects, and manage engineering workflows. Let Claude stay in sync with your development roadmap.',
    category: 'Development',
    tools: ['Issues', 'Projects', 'Workflows', 'Teams'],
    status: 'official'
  },
  {
    id: 'sentry-mcp',
    name: 'Sentry',
    description: 'Query error tracking data, access crash reports, and manage releases. Enable Claude to triage bugs and suggest fixes based on stack traces.',
    category: 'Development',
    tools: ['Error Tracking', 'Issues', 'Releases', 'Alerts'],
    status: 'community'
  },

  // Data & Storage
  {
    id: 'postgresql-mcp',
    name: 'PostgreSQL',
    description: 'Query databases, read schemas, execute safe SQL, and fetch data. Let Claude analyze your database structure and answer questions about data.',
    category: 'Data & Storage',
    tools: ['Query', 'Schema Inspection', 'Analytics'],
    status: 'official',
    relatedLearnSlug: 'database-mcp-integration'
  },
  {
    id: 'google-drive-mcp',
    name: 'Google Drive',
    description: 'Read and manage files in Drive and Sheets. Enable Claude to understand documents, extract data, and organize shared files.',
    category: 'Data & Storage',
    tools: ['Files', 'Folders', 'Permissions', 'Search'],
    status: 'official'
  },
  {
    id: 'notion-mcp',
    name: 'Notion',
    description: 'Query Notion databases, read pages, and update content. Let Claude integrate with your knowledge base and wiki systems.',
    category: 'Data & Storage',
    tools: ['Databases', 'Pages', 'Properties', 'Search'],
    status: 'official',
    relatedLearnSlug: 'notion-ai-integration'
  },
  {
    id: 'airtable-mcp',
    name: 'Airtable',
    description: 'Connect to bases and tables, read records, and update data. Enable Claude to work with structured data without leaving your workflows.',
    category: 'Data & Storage',
    tools: ['Bases', 'Tables', 'Records', 'Views'],
    status: 'official'
  },

  // Communication
  {
    id: 'gmail-mcp',
    name: 'Gmail',
    description: 'Read emails, search inboxes, draft messages, and manage labels. Let Claude help with email organization and smart responses.',
    category: 'Communication',
    tools: ['Email', 'Search', 'Labels', 'Attachments'],
    status: 'official',
    relatedLearnSlug: 'gmail-ai-automation'
  },
  {
    id: 'outlook-mcp',
    name: 'Outlook',
    description: 'Access Outlook mailboxes, read calendar events, and manage messages. Integrate Claude with Microsoft email infrastructure.',
    category: 'Communication',
    tools: ['Email', 'Calendar', 'Contacts', 'Attachments'],
    status: 'community'
  },
  {
    id: 'twilio-mcp',
    name: 'Twilio',
    description: 'Send SMS messages, manage phone calls, and access communication logs. Let Claude handle messaging workflows and customer notifications.',
    category: 'Communication',
    tools: ['SMS', 'Voice', 'Messaging', 'Logs'],
    status: 'community'
  }
];

export const categories = Array.from(new Set(servers.map(s => s.category))).sort();
