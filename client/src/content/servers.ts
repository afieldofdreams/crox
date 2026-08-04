export interface MCPServerEntry {
  id: string;
  name: string;
  description: string;
  category: string;
  tools: string[];
  status: 'official' | 'community' | 'custom';
  url?: string;
}

/** Deterministic weekly rotation over official servers, evaluated at build
 * time — each deploy features whichever server the current ISO week lands
 * on, so the spotlight can never go stale the way a hardcoded pick did. */
export function getFeaturedServer(): { server: MCPServerEntry; weekOf: string } {
  const eligible = servers.filter((s) => s.status === 'official' && s.url);
  const now = new Date();
  const monday = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() - ((now.getUTCDay() + 6) % 7)
    )
  );
  const weekIndex = Math.floor(monday.getTime() / (7 * 24 * 3600 * 1000));
  return {
    server: eligible[weekIndex % eligible.length],
    weekOf: monday.toISOString().slice(0, 10),
  };
}

export const servers: MCPServerEntry[] = [
  // ─── Business Tools ───────────────────────────────────────────────

  {
    id: 'slack-mcp',
    name: 'Slack',
    description: 'Send messages, manage channels, search conversations, and automate workflows across your Slack workspace.',
    category: 'Business Tools',
    tools: ['Messaging', 'Channel Management', 'Search', 'User Management'],
    status: 'official',
    url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/slack'
  },
  {
    id: 'hubspot-mcp',
    name: 'HubSpot',
    description: 'Access contacts, deals, pipelines, and customer data. Enable AI to qualify leads, update CRM records, and generate sales insights.',
    category: 'Business Tools',
    tools: ['CRM', 'Contacts', 'Deals', 'Analytics'],
    status: 'official',
    url: 'https://developers.hubspot.com/docs/guides/mcp'
  },
  {
    id: 'salesforce-mcp',
    name: 'Salesforce',
    description: 'Connect to Salesforce orgs to query objects, create/update records, and execute workflows. Manage opportunities, accounts, and custom objects.',
    category: 'Business Tools',
    tools: ['CRM', 'Objects', 'Workflows', 'Reports'],
    status: 'official',
    url: 'https://github.com/salesforce/salesforce-mcp'
  },
  {
    id: 'google-workspace-mcp',
    name: 'Google Workspace',
    description: 'Integrate with Gmail, Google Docs, Sheets, and Drive. Read documents, create presentations, and manage workspace data at scale.',
    category: 'Business Tools',
    tools: ['Gmail', 'Docs', 'Sheets', 'Drive', 'Slides'],
    status: 'official',
    url: 'https://github.com/anthropics/anthropic-quickstarts/tree/main/google-workspace-mcp'
  },
  {
    id: 'microsoft-365-mcp',
    name: 'Microsoft 365',
    description: 'Access Outlook, Teams, Excel, Word, and OneDrive. Automate email workflows, manage documents, and integrate with Azure services.',
    category: 'Business Tools',
    tools: ['Outlook', 'Teams', 'Excel', 'Word', 'OneDrive'],
    status: 'official',
    url: 'https://github.com/microsoft/mcp-servers'
  },
  {
    id: 'atlassian-mcp',
    name: 'Atlassian',
    description: 'Interact with Jira work items and Confluence pages. Manage tickets, search documentation, and streamline project workflows.',
    category: 'Business Tools',
    tools: ['Jira', 'Confluence', 'Issues', 'Pages', 'Search'],
    status: 'official',
    url: 'https://github.com/sooperset/mcp-atlassian'
  },
  {
    id: 'clickup-mcp',
    name: 'ClickUp',
    description: 'Manage tasks, checklists, sprints, comments, and docs. Create and update work items, track progress, and automate project management.',
    category: 'Business Tools',
    tools: ['Tasks', 'Sprints', 'Docs', 'Comments', 'Time Tracking'],
    status: 'community',
    url: 'https://github.com/TaazKarma/clickup-mcp-server'
  },
  {
    id: 'asana-mcp',
    name: 'Asana',
    description: 'Interact with Asana projects, tasks, and teams. Automate task creation, update statuses, and manage project timelines.',
    category: 'Business Tools',
    tools: ['Tasks', 'Projects', 'Teams', 'Workflows'],
    status: 'community',
    url: 'https://github.com/roychri/mcp-server-asana'
  },
  {
    id: 'trello-mcp',
    name: 'Trello',
    description: 'Manage Trello boards, lists, and cards. Automate card creation, move items across workflows, and query board data.',
    category: 'Business Tools',
    tools: ['Boards', 'Cards', 'Lists', 'Labels'],
    status: 'community',
    url: 'https://github.com/m0xai/trello-mcp-server'
  },
  {
    id: 'todoist-mcp',
    name: 'Todoist',
    description: 'Natural language task management with Todoist. Create, update, and organize tasks and projects via REST and Sync APIs.',
    category: 'Business Tools',
    tools: ['Tasks', 'Projects', 'Labels', 'Filters'],
    status: 'community',
    url: 'https://github.com/abhiz123/todoist-mcp-server'
  },
  {
    id: 'plane-mcp',
    name: 'Plane',
    description: 'Open-source project management with full AI automation. Manage issues, cycles, modules, and project views.',
    category: 'Business Tools',
    tools: ['Issues', 'Cycles', 'Modules', 'Views'],
    status: 'official',
    url: 'https://github.com/makeplane/plane-mcp'
  },
  {
    id: 'fibery-mcp',
    name: 'Fibery',
    description: 'Query entities, manage work items, and interact with custom databases in your Fibery workspace. Build AI-powered workflows on top of your connected workspace.',
    category: 'Business Tools',
    tools: ['Entities', 'Queries', 'Databases', 'Workflows', 'Documents'],
    status: 'official',
    url: 'https://fibery.io/blog/fibery-mcp-server'
  },
  {
    id: 'dart-mcp',
    name: 'Dart',
    description: 'Interact with task, doc, and project data in Dart. Manage workflows and keep project information synchronized.',
    category: 'Business Tools',
    tools: ['Tasks', 'Docs', 'Projects', 'Properties'],
    status: 'official',
    url: 'https://github.com/its-dart/dart-mcp-server'
  },
  {
    id: 'taskade-mcp',
    name: 'Taskade',
    description: 'Connect to Taskade for AI-powered task management, notes, and team collaboration workflows.',
    category: 'Business Tools',
    tools: ['Tasks', 'Notes', 'Workflows', 'Collaboration'],
    status: 'official',
    url: 'https://github.com/taskade/taskade-mcp-server'
  },
  {
    id: 'linear-mcp',
    name: 'Linear',
    description: 'Connect to Linear workspaces to create issues, update projects, and manage engineering workflows. Stay in sync with your development roadmap.',
    category: 'Business Tools',
    tools: ['Issues', 'Projects', 'Workflows', 'Teams'],
    status: 'official',
    url: 'https://github.com/jerhadf/linear-mcp-server'
  },

  // ─── Finance & Accounting ─────────────────────────────────────────

  {
    id: 'xero-mcp',
    name: 'Xero',
    description: 'Connect to accounting data: invoices, bills, contacts, and bank transactions. Analyze financial health and automate bookkeeping tasks.',
    category: 'Finance & Accounting',
    tools: ['Invoicing', 'Bills', 'Bank Reconciliation', 'Financial Reports'],
    status: 'official',
    url: 'https://github.com/XeroAPI/xero-mcp-server'
  },
  {
    id: 'quickbooks-mcp',
    name: 'QuickBooks',
    description: 'Manage invoices, expenses, and accounts. Extract financial data, create reports, and sync transactions.',
    category: 'Finance & Accounting',
    tools: ['Invoicing', 'Expenses', 'Reports', 'Accounts'],
    status: 'community',
    url: 'https://github.com/hannesrudolph/quickbooks-mcp-server'
  },
  {
    id: 'stripe-mcp',
    name: 'Stripe',
    description: 'Query payment events, manage customers, retrieve invoices, and analyze payment data. Understand transaction patterns and refund requests.',
    category: 'Finance & Accounting',
    tools: ['Payments', 'Invoices', 'Customers', 'Transactions'],
    status: 'official',
    url: 'https://github.com/stripe/agent-toolkit'
  },
  {
    id: 'paypal-mcp',
    name: 'PayPal',
    description: 'Payment processing, transaction management, and merchant operations through AI-powered function calling.',
    category: 'Finance & Accounting',
    tools: ['Payments', 'Transactions', 'Invoices', 'Merchant Tools'],
    status: 'official',
    url: 'https://github.com/paypal/agent-toolkit'
  },
  {
    id: 'square-mcp',
    name: 'Square',
    description: 'Connect to Square for payment processing, inventory management, and point-of-sale operations.',
    category: 'Finance & Accounting',
    tools: ['Payments', 'Inventory', 'POS', 'Customers'],
    status: 'official',
    url: 'https://github.com/square/square-mcp-server'
  },
  {
    id: 'alpaca-mcp',
    name: 'Alpaca',
    description: 'Trade stocks and options, analyze market data, and build trading strategies. Interact with brokerage accounts in real time.',
    category: 'Finance & Accounting',
    tools: ['Trading', 'Market Data', 'Portfolios', 'Options'],
    status: 'official',
    url: 'https://github.com/alpacahq/alpaca-mcp-server'
  },
  {
    id: 'alphavantage-mcp',
    name: 'Alpha Vantage',
    description: 'Connect to 100+ APIs for financial market data including stock prices, forex rates, cryptocurrency, and fundamentals.',
    category: 'Finance & Accounting',
    tools: ['Stock Prices', 'Forex', 'Crypto', 'Fundamentals'],
    status: 'official',
    url: 'https://github.com/calvernaz/alphavantage-mcp'
  },
  {
    id: 'chargebee-mcp',
    name: 'Chargebee',
    description: 'Connect AI agents to Chargebee billing. Manage subscriptions, invoices, and revenue operations programmatically.',
    category: 'Finance & Accounting',
    tools: ['Subscriptions', 'Billing', 'Invoices', 'Revenue'],
    status: 'official',
    url: 'https://github.com/chargebee/agentkit'
  },
  {
    id: 'revenuecat-mcp',
    name: 'RevenueCat',
    description: 'Manage in-app purchases and subscription data. Track revenue, entitlements, and subscriber analytics.',
    category: 'Finance & Accounting',
    tools: ['Subscriptions', 'In-App Purchases', 'Revenue', 'Analytics'],
    status: 'official',
    url: 'https://github.com/nicklasbekkevold/revenuecat-mcp'
  },
  {
    id: 'ramp-mcp',
    name: 'Ramp',
    description: 'Spend analysis, expense management, and corporate card operations via Ramp\'s Developer API.',
    category: 'Finance & Accounting',
    tools: ['Expenses', 'Spend Analysis', 'Cards', 'Transactions'],
    status: 'official',
    url: 'https://github.com/ramp-public/ramp-mcp-server'
  },
  {
    id: 'airwallex-mcp',
    name: 'Airwallex',
    description: 'AI coding assistance for integrating with Airwallex payment and treasury APIs. Streamline cross-border payments.',
    category: 'Finance & Accounting',
    tools: ['Payments', 'Treasury', 'FX', 'Integration'],
    status: 'official',
    url: 'https://github.com/nicholasgriffintn/airwallex-mcp'
  },
  {
    id: 'adfin-mcp',
    name: 'Adfin',
    description: 'All-in-one platform for payments, invoicing, and accounting reconciliations. Automate financial workflows.',
    category: 'Finance & Accounting',
    tools: ['Payments', 'Invoicing', 'Reconciliation', 'Accounting'],
    status: 'official',
    url: 'https://github.com/adfin/adfin-mcp'
  },
  {
    id: 'coingecko-mcp',
    name: 'CoinGecko',
    description: 'Comprehensive crypto price data, market caps, trading volumes, and token information via the official CoinGecko API.',
    category: 'Finance & Accounting',
    tools: ['Prices', 'Market Data', 'Tokens', 'Exchanges'],
    status: 'official',
    url: 'https://github.com/coingecko/coingecko-mcp-server'
  },

  // ─── Development & DevOps ─────────────────────────────────────────

  {
    id: 'github-mcp',
    name: 'GitHub',
    description: 'Search repos, read code, create issues, manage PRs, and trigger workflows. Understand codebases and contribute to development cycles.',
    category: 'Development & DevOps',
    tools: ['Repos', 'Issues', 'Pull Requests', 'Actions', 'Code Search'],
    status: 'official',
    url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/github'
  },
  {
    id: 'gitlab-mcp',
    name: 'GitLab',
    description: 'Manage projects, merge requests, CI/CD pipelines, and repository data on GitLab instances.',
    category: 'Development & DevOps',
    tools: ['Projects', 'Merge Requests', 'CI/CD', 'Repository'],
    status: 'community',
    url: 'https://gitlab.com/gitlab-org/editor-extensions/gitlab-mcp-server'
  },
  {
    id: 'sentry-mcp',
    name: 'Sentry',
    description: 'Query error tracking data, access crash reports, and manage releases. Triage bugs and suggest fixes based on stack traces.',
    category: 'Development & DevOps',
    tools: ['Error Tracking', 'Issues', 'Releases', 'Alerts'],
    status: 'official',
    url: 'https://github.com/getsentry/sentry-mcp'
  },
  {
    id: 'terraform-mcp',
    name: 'Terraform',
    description: 'Access Terraform Registry documentation, modules, and provider schemas. Generate accurate infrastructure-as-code configurations.',
    category: 'Development & DevOps',
    tools: ['Registry', 'Providers', 'Modules', 'IaC Generation'],
    status: 'official',
    url: 'https://github.com/hashicorp/terraform-mcp-server'
  },
  {
    id: 'playwright-mcp',
    name: 'Playwright',
    description: 'Official Microsoft Playwright MCP server for browser automation, testing, and web interaction.',
    category: 'Development & DevOps',
    tools: ['Browser Automation', 'Testing', 'Screenshots', 'Web Interaction'],
    status: 'official',
    url: 'https://github.com/microsoft/playwright-mcp'
  },
  {
    id: 'azure-devops-mcp',
    name: 'Azure DevOps',
    description: 'Interact with Azure DevOps repositories, work items, builds, releases, and test plans.',
    category: 'Development & DevOps',
    tools: ['Repos', 'Work Items', 'Builds', 'Releases', 'Pipelines'],
    status: 'official',
    url: 'https://github.com/nicholasgriffintn/azure-devops-mcp'
  },
  {
    id: 'buildkite-mcp',
    name: 'Buildkite',
    description: 'Manage Buildkite CI/CD pipelines and builds. Monitor build status, trigger deployments, and analyze failures.',
    category: 'Development & DevOps',
    tools: ['Pipelines', 'Builds', 'Agents', 'Artifacts'],
    status: 'official',
    url: 'https://github.com/buildkite/buildkite-mcp-server'
  },
  {
    id: 'circleci-mcp',
    name: 'CircleCI',
    description: 'Investigate and fix CircleCI build failures. Access pipeline data, job logs, and configuration insights.',
    category: 'Development & DevOps',
    tools: ['Pipelines', 'Jobs', 'Builds', 'Debugging'],
    status: 'official',
    url: 'https://github.com/CircleCI-Public/mcp-server-circleci'
  },
  {
    id: 'cloudflare-mcp',
    name: 'Cloudflare',
    description: 'Deploy, configure, and manage resources on Cloudflare. Workers, Pages, DNS, and security settings.',
    category: 'Development & DevOps',
    tools: ['Workers', 'Pages', 'DNS', 'Security', 'KV'],
    status: 'official',
    url: 'https://github.com/cloudflare/mcp-server-cloudflare'
  },
  {
    id: 'netlify-mcp',
    name: 'Netlify',
    description: 'Create projects, manage deployments, and configure build settings through AI-powered workflows.',
    category: 'Development & DevOps',
    tools: ['Deployments', 'Builds', 'Sites', 'Functions'],
    status: 'official',
    url: 'https://docs.netlify.com/build/build-with-ai/netlify-mcp-server/'
  },
  {
    id: 'render-mcp',
    name: 'Render',
    description: 'Official Render MCP server for cloud service deployment. Manage web services, databases, and static sites.',
    category: 'Development & DevOps',
    tools: ['Deployments', 'Services', 'Databases', 'Static Sites'],
    status: 'official',
    url: 'https://github.com/render-oss/render-mcp-server'
  },
  {
    id: 'vercel-nextjs-mcp',
    name: 'Next.js DevTools',
    description: 'Next.js development tools for AI coding assistants. Debug, inspect, and optimize Next.js applications.',
    category: 'Development & DevOps',
    tools: ['Next.js', 'Debugging', 'Optimization', 'DevTools'],
    status: 'official',
    url: 'https://github.com/nicholasgriffintn/nextjs-mcp'
  },
  {
    id: 'aws-mcp',
    name: 'AWS',
    description: 'Specialized MCP servers for AWS services including CDK, Lambda, ECS, EKS, Bedrock, and cost analysis.',
    category: 'Development & DevOps',
    tools: ['CDK', 'Lambda', 'ECS', 'Documentation', 'Cost Analysis'],
    status: 'official',
    url: 'https://awslabs.github.io/mcp/'
  },
  {
    id: 'azure-mcp',
    name: 'Azure',
    description: 'Access key Azure services including Storage, Cosmos DB, and Azure CLI. Manage cloud resources through AI.',
    category: 'Development & DevOps',
    tools: ['Storage', 'Cosmos DB', 'CLI', 'Resources'],
    status: 'official',
    url: 'https://github.com/Azure/azure-mcp-server'
  },
  {
    id: 'google-cloud-run-mcp',
    name: 'Google Cloud Run',
    description: 'Deploy and manage applications on Google Cloud Run. Automate container deployment and scaling.',
    category: 'Development & DevOps',
    tools: ['Deployments', 'Containers', 'Scaling', 'Services'],
    status: 'official',
    url: 'https://github.com/nicholasgriffintn/google-cloud-run-mcp'
  },
  {
    id: 'docker-mcp',
    name: 'Docker',
    description: 'Manage Docker containers, images, and compose stacks. Container orchestration, debugging, and deployment.',
    category: 'Development & DevOps',
    tools: ['Containers', 'Images', 'Compose', 'Volumes'],
    status: 'community',
    url: 'https://github.com/ckreiling/mcp-server-docker'
  },
  {
    id: 'kubernetes-mcp',
    name: 'Kubernetes',
    description: 'Interact with Kubernetes clusters. Manage pods, deployments, services, and troubleshoot cluster issues.',
    category: 'Development & DevOps',
    tools: ['Pods', 'Deployments', 'Services', 'Namespaces'],
    status: 'community',
    url: 'https://github.com/strowk/mcp-k8s-go'
  },
  {
    id: 'postman-mcp',
    name: 'Postman',
    description: 'Connect AI agents directly to APIs through Postman. Test endpoints, manage collections, and automate workflows.',
    category: 'Development & DevOps',
    tools: ['API Testing', 'Collections', 'Environments', 'Workflows'],
    status: 'official',
    url: 'https://github.com/nicholasgriffintn/postman-mcp'
  },
  {
    id: 'jetbrains-mcp',
    name: 'JetBrains',
    description: 'Work on your code with JetBrains IDEs. Interact with your development environment, run actions, and navigate code.',
    category: 'Development & DevOps',
    tools: ['IDE', 'Code Navigation', 'Refactoring', 'Debugging'],
    status: 'official',
    url: 'https://github.com/nicholasgriffintn/jetbrains-mcp'
  },
  {
    id: 'sonarqube-mcp',
    name: 'SonarQube',
    description: 'Integration with SonarQube for static code analysis, quality gates, and security vulnerability detection.',
    category: 'Development & DevOps',
    tools: ['Code Quality', 'Security Scanning', 'Quality Gates', 'Reports'],
    status: 'official',
    url: 'https://github.com/SonarSource/sonarqube-mcp-server'
  },
  {
    id: 'semgrep-mcp',
    name: 'Semgrep',
    description: 'Secure code with Semgrep static analysis. Find vulnerabilities, enforce coding standards, and automate security reviews.',
    category: 'Development & DevOps',
    tools: ['SAST', 'Security Rules', 'Code Scanning', 'Compliance'],
    status: 'official',
    url: 'https://github.com/semgrep/mcp'
  },
  {
    id: 'e2b-mcp',
    name: 'E2B',
    description: 'Run code in secure cloud sandboxes. Execute Python, JavaScript, and other languages safely in isolated environments.',
    category: 'Development & DevOps',
    tools: ['Sandboxed Execution', 'Python', 'JavaScript', 'Isolation'],
    status: 'official',
    url: 'https://github.com/e2b-dev/mcp-server'
  },
  {
    id: 'harness-mcp',
    name: 'Harness',
    description: 'Access Harness platform data for CI/CD, feature flags, and cloud cost management.',
    category: 'Development & DevOps',
    tools: ['CI/CD', 'Feature Flags', 'Cloud Cost', 'Deployments'],
    status: 'official',
    url: 'https://github.com/harness/mcp-server'
  },
  {
    id: 'browserstack-mcp',
    name: 'BrowserStack',
    description: 'Full BrowserStack Test Platform access for cross-browser testing. Run tests across real devices and browsers.',
    category: 'Development & DevOps',
    tools: ['Cross-Browser Testing', 'Real Devices', 'Automation', 'Screenshots'],
    status: 'official',
    url: 'https://github.com/nicholasgriffintn/browserstack-mcp'
  },
  {
    id: 'dbt-mcp',
    name: 'dbt',
    description: 'Official dbt MCP server providing project metadata, model lineage, and analytics engineering context.',
    category: 'Development & DevOps',
    tools: ['Models', 'Lineage', 'Testing', 'Documentation'],
    status: 'official',
    url: 'https://github.com/dbt-labs/dbt-mcp'
  },
  {
    id: 'gitkraken-mcp',
    name: 'GitKraken',
    description: 'CLI for GitKraken APIs including integrations with Jira, GitHub, and GitLab. Manage repos and code reviews.',
    category: 'Development & DevOps',
    tools: ['Git', 'Code Review', 'Integrations', 'Workflows'],
    status: 'official',
    url: 'https://github.com/nicholasgriffintn/gitkraken-mcp'
  },
  {
    id: 'apollo-graphql-mcp',
    name: 'Apollo GraphQL',
    description: 'Connect GraphQL APIs to AI agents. Query schemas, run operations, and explore your graph.',
    category: 'Development & DevOps',
    tools: ['GraphQL', 'Schemas', 'Queries', 'Mutations'],
    status: 'official',
    url: 'https://github.com/apollographql/apollo-mcp-server'
  },
  {
    id: 'apimatic-mcp',
    name: 'APIMatic',
    description: 'Validate OpenAPI specifications. Ensure API designs meet quality standards before implementation.',
    category: 'Development & DevOps',
    tools: ['OpenAPI Validation', 'API Quality', 'Specifications', 'Linting'],
    status: 'official',
    url: 'https://github.com/apimatic/apimatic-mcp-server'
  },
  {
    id: 'lingo-dev-mcp',
    name: 'Lingo.dev',
    description: 'Make your AI agent speak every language. Automate i18n and translation workflows with a localization engine.',
    category: 'Development & DevOps',
    tools: ['Localization', 'Translation', 'i18n', 'Languages'],
    status: 'official',
    url: 'https://github.com/nicholasgriffintn/lingo-dev-mcp'
  },
  {
    id: 'xcodebuild-mcp',
    name: 'XcodeBuild MCP',
    description: 'Build and test iOS, macOS, and visionOS apps. Integrate Xcode build processes into AI-assisted development.',
    category: 'Development & DevOps',
    tools: ['iOS', 'macOS', 'Build', 'Testing'],
    status: 'community',
    url: 'https://github.com/nicholasgriffintn/xcodebuild-mcp'
  },
  {
    id: 'chrome-devtools-mcp',
    name: 'Chrome DevTools',
    description: 'Control and inspect a live Chrome browser. Debug web apps, analyze performance, and interact with the DOM.',
    category: 'Development & DevOps',
    tools: ['Browser Debugging', 'DOM', 'Network', 'Performance'],
    status: 'community',
    url: 'https://github.com/nicholasgriffintn/chrome-devtools-mcp'
  },
  {
    id: 'appium-mcp',
    name: 'Appium',
    description: 'Mobile development and automation for iOS and Android. Test on simulators, emulators, and real devices.',
    category: 'Development & DevOps',
    tools: ['Mobile Testing', 'iOS', 'Android', 'Automation'],
    status: 'official',
    url: 'https://github.com/nicholasgriffintn/appium-mcp'
  },

  // ─── Data & Storage ───────────────────────────────────────────────

  {
    id: 'postgresql-mcp',
    name: 'PostgreSQL',
    description: 'Query databases, read schemas, execute safe SQL, and fetch data. Analyze database structure and answer questions about data.',
    category: 'Data & Storage',
    tools: ['Query', 'Schema Inspection', 'Analytics'],
    status: 'official',
    url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/postgres'
  },
  {
    id: 'sqlite-mcp',
    name: 'SQLite',
    description: 'Query and manage SQLite databases. Local data analysis, prototyping, and embedded database operations.',
    category: 'Data & Storage',
    tools: ['SQL', 'Schema', 'Local Database', 'Analytics'],
    status: 'official',
    url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/sqlite'
  },
  {
    id: 'google-drive-mcp',
    name: 'Google Drive',
    description: 'Read and manage files in Drive and Sheets. Understand documents, extract data, and organize shared files.',
    category: 'Data & Storage',
    tools: ['Files', 'Folders', 'Permissions', 'Search'],
    status: 'official',
    url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/gdrive'
  },
  {
    id: 'notion-mcp',
    name: 'Notion',
    description: 'Query Notion databases, read pages, and update content. Integrate with your knowledge base and wiki systems.',
    category: 'Data & Storage',
    tools: ['Databases', 'Pages', 'Properties', 'Search'],
    status: 'official',
    url: 'https://github.com/makenotion/notion-mcp-server'
  },
  {
    id: 'airtable-mcp',
    name: 'Airtable',
    description: 'Connect to bases and tables, read records, and update data. Work with structured data without leaving your workflows.',
    category: 'Data & Storage',
    tools: ['Bases', 'Tables', 'Records', 'Views'],
    status: 'official',
    url: 'https://github.com/nicholasgriffintn/airtable-mcp'
  },
  {
    id: 'snowflake-mcp',
    name: 'Snowflake',
    description: 'Query data, manage schemas, and interact with Cortex AI. Run SQL, consume semantic views, and orchestrate data warehouse operations.',
    category: 'Data & Storage',
    tools: ['SQL', 'Cortex AI', 'Schema Management', 'Semantic Views'],
    status: 'official',
    url: 'https://github.com/Snowflake-Labs/mcp'
  },
  {
    id: 'bigquery-mcp',
    name: 'BigQuery',
    description: 'Access Google BigQuery for large-scale data analytics. Inspect schemas, execute queries, and analyze datasets.',
    category: 'Data & Storage',
    tools: ['SQL', 'Schema Inspection', 'Analytics', 'Datasets'],
    status: 'community',
    url: 'https://github.com/nicholasgriffintn/bigquery-mcp'
  },
  {
    id: 'mongodb-mcp',
    name: 'MongoDB',
    description: 'Full-featured MCP server for MongoDB databases. Query collections, manage documents, and interact with NoSQL data.',
    category: 'Data & Storage',
    tools: ['Collections', 'Documents', 'Queries', 'Aggregation'],
    status: 'official',
    url: 'https://github.com/mongodb-labs/mongodb-mcp-server'
  },
  {
    id: 'mysql-mcp',
    name: 'MySQL',
    description: 'MySQL database integration with configurable access controls and schema inspection.',
    category: 'Data & Storage',
    tools: ['SQL', 'Schema', 'Query', 'Access Control'],
    status: 'community',
    url: 'https://github.com/nicholasgriffintn/mysql-mcp-server'
  },
  {
    id: 'redis-mcp',
    name: 'Redis',
    description: 'Interact with Redis for caching, session management, and real-time data operations.',
    category: 'Data & Storage',
    tools: ['Cache', 'Keys', 'Data Structures', 'Pub/Sub'],
    status: 'official',
    url: 'https://github.com/redis/mcp-redis'
  },
  {
    id: 'neo4j-mcp',
    name: 'Neo4j',
    description: 'Graph database with schema inspection and Cypher query support. Explore relationships and graph structures.',
    category: 'Data & Storage',
    tools: ['Cypher', 'Graph Queries', 'Schema', 'Relationships'],
    status: 'community',
    url: 'https://github.com/neo4j-contrib/mcp-neo4j'
  },
  {
    id: 'clickhouse-mcp',
    name: 'ClickHouse',
    description: 'Query ClickHouse for real-time analytics. Execute SQL, inspect schemas, and analyze large-scale columnar data.',
    category: 'Data & Storage',
    tools: ['SQL', 'Analytics', 'Schema', 'Columnar Data'],
    status: 'official',
    url: 'https://github.com/ClickHouse/mcp-clickhouse'
  },
  {
    id: 'elasticsearch-mcp',
    name: 'Elasticsearch',
    description: 'Search, query, and manage Elasticsearch indices. Full-text search, aggregations, and data analysis.',
    category: 'Data & Storage',
    tools: ['Search', 'Indexing', 'Aggregations', 'Analytics'],
    status: 'community',
    url: 'https://github.com/nicholasgriffintn/elasticsearch-mcp'
  },
  {
    id: 'supabase-mcp',
    name: 'Supabase',
    description: 'Database management, authentication, storage, and edge functions. Build and manage full-stack backends.',
    category: 'Data & Storage',
    tools: ['Database', 'Auth', 'Storage', 'Edge Functions'],
    status: 'community',
    url: 'https://github.com/supabase-community/supabase-mcp'
  },
  {
    id: 'neon-mcp',
    name: 'Neon',
    description: 'Interact with Neon serverless Postgres. Manage branches, databases, and roles with AI-powered administration.',
    category: 'Data & Storage',
    tools: ['Serverless Postgres', 'Branches', 'Databases', 'Roles'],
    status: 'official',
    url: 'https://github.com/neondatabase/mcp-server-neon'
  },
  {
    id: 'astra-db-mcp',
    name: 'Astra DB',
    description: 'Manage collections and documents in DataStax Astra DB. NoSQL cloud database for AI-powered data operations.',
    category: 'Data & Storage',
    tools: ['Collections', 'Documents', 'Vector Search', 'NoSQL'],
    status: 'official',
    url: 'https://github.com/datastax/astra-db-mcp'
  },
  {
    id: 'couchbase-mcp',
    name: 'Couchbase',
    description: 'Interact with data in Couchbase clusters. Query, manage buckets, and perform full-text search.',
    category: 'Data & Storage',
    tools: ['N1QL', 'Buckets', 'Full-Text Search', 'Documents'],
    status: 'official',
    url: 'https://github.com/couchbase/mcp-server-couchbase'
  },
  {
    id: 'chroma-mcp',
    name: 'Chroma',
    description: 'Embeddings, vector search, document storage, and full-text search. Build semantic search and RAG applications.',
    category: 'Data & Storage',
    tools: ['Vector Search', 'Embeddings', 'Documents', 'Full-Text Search'],
    status: 'official',
    url: 'https://github.com/chroma-core/chroma-mcp'
  },
  {
    id: 'qdrant-mcp',
    name: 'Qdrant',
    description: 'Semantic memory layers on Qdrant vector search engine. Store and retrieve contextual information for AI apps.',
    category: 'Data & Storage',
    tools: ['Vector Search', 'Semantic Memory', 'Collections', 'Similarity'],
    status: 'official',
    url: 'https://github.com/qdrant/mcp-server-qdrant'
  },
  {
    id: 'milvus-mcp',
    name: 'Milvus',
    description: 'Search, query, and interact with data in Milvus vector database. Scalable similarity search for AI applications.',
    category: 'Data & Storage',
    tools: ['Vector Search', 'Collections', 'Indexing', 'Similarity'],
    status: 'official',
    url: 'https://github.com/zilliztech/mcp-server-milvus'
  },
  {
    id: 'singlestore-mcp',
    name: 'SingleStore',
    description: 'Interact with SingleStore distributed database. Execute queries and manage real-time analytics workloads.',
    category: 'Data & Storage',
    tools: ['SQL', 'Real-Time Analytics', 'Schema', 'Pipelines'],
    status: 'official',
    url: 'https://github.com/singlestore-labs/mcp-server-singlestore'
  },
  {
    id: 'motherduck-mcp',
    name: 'MotherDuck',
    description: 'Query and analyze data with cloud-based DuckDB. Run analytics on local and remote data seamlessly.',
    category: 'Data & Storage',
    tools: ['DuckDB', 'SQL', 'Analytics', 'Cloud Data'],
    status: 'official',
    url: 'https://github.com/motherduckdb/mcp-server-motherduck'
  },
  {
    id: 'prisma-mcp',
    name: 'Prisma',
    description: 'Manage Prisma Postgres databases. Create schemas, run migrations, and interact through the Prisma ORM.',
    category: 'Data & Storage',
    tools: ['ORM', 'Migrations', 'Schema', 'Postgres'],
    status: 'official',
    url: 'https://github.com/nicholasgriffintn/prisma-mcp'
  },
  {
    id: 'convex-mcp',
    name: 'Convex',
    description: 'Introspect and query your apps deployed to Convex. Access real-time backend data, functions, and schema.',
    category: 'Data & Storage',
    tools: ['Backend', 'Real-Time Data', 'Functions', 'Schema'],
    status: 'official',
    url: 'https://github.com/get-convex/convex-mcp-server'
  },
  {
    id: 'tinybird-mcp',
    name: 'Tinybird',
    description: 'Serverless ClickHouse platform. Build real-time analytics APIs and query streaming data.',
    category: 'Data & Storage',
    tools: ['Real-Time Analytics', 'APIs', 'SQL', 'Streaming'],
    status: 'official',
    url: 'https://github.com/tinybirdco/mcp-tinybird'
  },
  {
    id: 'teradata-mcp',
    name: 'Teradata',
    description: 'Manage Teradata enterprise databases. Execute queries, manage schemas, and perform large-scale warehousing.',
    category: 'Data & Storage',
    tools: ['SQL', 'Data Warehouse', 'Schema', 'Enterprise'],
    status: 'official',
    url: 'https://github.com/Teradata/teradata-mcp-server'
  },
  {
    id: 'baserow-mcp',
    name: 'Baserow',
    description: 'Read and write access to Baserow tables. Open-source no-code database platform with AI assistance.',
    category: 'Data & Storage',
    tools: ['Tables', 'Records', 'Views', 'No-Code Database'],
    status: 'official',
    url: 'https://github.com/nicholasgriffintn/baserow-mcp'
  },

  // ─── Communication ────────────────────────────────────────────────

  {
    id: 'gmail-mcp',
    name: 'Gmail',
    description: 'Read emails, search inboxes, draft messages, and manage labels. Email organization and smart responses.',
    category: 'Communication',
    tools: ['Email', 'Search', 'Labels', 'Attachments'],
    status: 'official',
    url: 'https://github.com/nicholasgriffintn/gmail-mcp'
  },
  {
    id: 'outlook-mcp',
    name: 'Outlook',
    description: 'Access Outlook mailboxes, read calendar events, and manage messages. Microsoft email infrastructure integration.',
    category: 'Communication',
    tools: ['Email', 'Calendar', 'Contacts', 'Attachments'],
    status: 'community',
    url: 'https://github.com/nicholasgriffintn/outlook-mcp'
  },
  {
    id: 'twilio-mcp',
    name: 'Twilio',
    description: 'Send SMS messages, manage phone calls, and access communication logs. Handle messaging workflows and notifications.',
    category: 'Communication',
    tools: ['SMS', 'Voice', 'Messaging', 'Logs'],
    status: 'community',
    url: 'https://github.com/twilio/twilio-mcp'
  },
  {
    id: 'intercom-mcp',
    name: 'Intercom',
    description: 'Connect to Intercom\'s customer messaging platform. Access conversations, customer data, and help center articles.',
    category: 'Communication',
    tools: ['Conversations', 'Customers', 'Help Center', 'Messaging'],
    status: 'official',
    url: 'https://developers.intercom.com/docs/guides/mcp'
  },
  {
    id: 'line-mcp',
    name: 'LINE',
    description: 'Integrate with LINE Messaging API. Connect AI agents with LINE Official Accounts for messaging.',
    category: 'Communication',
    tools: ['Messaging', 'Rich Menus', 'Push Messages', 'Webhooks'],
    status: 'official',
    url: 'https://github.com/nicholasgriffintn/line-mcp'
  },
  {
    id: 'mailgun-mcp',
    name: 'Mailgun',
    description: 'Interact with Mailgun email API for transactional email delivery, tracking, and analytics.',
    category: 'Communication',
    tools: ['Email Sending', 'Tracking', 'Analytics', 'Templates'],
    status: 'official',
    url: 'https://github.com/nicholasgriffintn/mailgun-mcp'
  },

  // ─── AI & Machine Learning ────────────────────────────────────────

  {
    id: 'sequential-thinking-mcp',
    name: 'Sequential Thinking',
    description: 'Dynamic and reflective problem-solving through thought sequences. Step-by-step reasoning and complex analysis.',
    category: 'AI & Machine Learning',
    tools: ['Reasoning', 'Problem Solving', 'Analysis', 'Thought Chains'],
    status: 'official',
    url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/sequentialthinking'
  },
  {
    id: 'memory-mcp',
    name: 'Memory',
    description: 'Knowledge graph-based persistent memory system. Store and retrieve contextual information across conversations.',
    category: 'AI & Machine Learning',
    tools: ['Knowledge Graph', 'Persistence', 'Context', 'Entities'],
    status: 'official',
    url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/memory'
  },
  {
    id: 'langfuse-mcp',
    name: 'Langfuse',
    description: 'Open-source collaborative prompt editing, versioning, and management. Track and optimize LLM prompts.',
    category: 'AI & Machine Learning',
    tools: ['Prompt Management', 'Versioning', 'Collaboration', 'Analytics'],
    status: 'official',
    url: 'https://github.com/langfuse/mcp-server-langfuse'
  },
  {
    id: 'arize-phoenix-mcp',
    name: 'Arize Phoenix',
    description: 'Inspect traces, manage prompts, curate datasets, and run experiments. Debug AI application performance.',
    category: 'AI & Machine Learning',
    tools: ['Tracing', 'Prompts', 'Datasets', 'Experiments'],
    status: 'official',
    url: 'https://github.com/Arize-ai/phoenix-mcp'
  },
  {
    id: 'kaggle-mcp',
    name: 'Kaggle',
    description: 'Access Kaggle datasets, models, competitions, and benchmarks. Explore data science resources with AI.',
    category: 'AI & Machine Learning',
    tools: ['Datasets', 'Models', 'Competitions', 'Notebooks'],
    status: 'official',
    url: 'https://github.com/nicholasgriffintn/kaggle-mcp'
  },
  {
    id: 'elevenlabs-mcp',
    name: 'ElevenLabs',
    description: 'AI voice generation. Create text-to-speech, voice cloning, and audio content with the official ElevenLabs MCP server.',
    category: 'AI & Machine Learning',
    tools: ['Text-to-Speech', 'Voice Cloning', 'Audio Generation', 'Voices'],
    status: 'official',
    url: 'https://github.com/elevenlabs/elevenlabs-mcp'
  },
  {
    id: 'perplexity-mcp',
    name: 'Perplexity',
    description: 'AI-powered web search and research via Perplexity\'s Sonar API. Comprehensive, cited answers to complex queries.',
    category: 'AI & Machine Learning',
    tools: ['Search', 'Research', 'Citations', 'Web Intelligence'],
    status: 'official',
    url: 'https://github.com/nicholasgriffintn/perplexity-mcp'
  },
  {
    id: 'deepwiki-mcp',
    name: 'DeepWiki by Devin',
    description: 'AI-powered codebase context and documentation. Intelligent answers about any public GitHub repository.',
    category: 'AI & Machine Learning',
    tools: ['Code Understanding', 'Documentation', 'Architecture', 'Context'],
    status: 'official',
    url: 'https://github.com/nicholasgriffintn/deepwiki-mcp'
  },

  // ─── E-commerce ───────────────────────────────────────────────────

  {
    id: 'shopify-mcp',
    name: 'Shopify',
    description: 'Official Shopify Dev MCP server. Access products, orders, customers, and Shopify API documentation.',
    category: 'E-commerce',
    tools: ['Products', 'Orders', 'Customers', 'API Docs', 'Inventory'],
    status: 'official',
    url: 'https://shopify.dev/docs/apps/build/dev-mcp'
  },
  {
    id: 'woocommerce-mcp',
    name: 'WooCommerce',
    description: 'Manage WooCommerce stores. Handle products, orders, customers, shipping, and store configuration.',
    category: 'E-commerce',
    tools: ['Products', 'Orders', 'Customers', 'Shipping', 'Configuration'],
    status: 'community',
    url: 'https://developer.woocommerce.com/docs/features/mcp/'
  },
  {
    id: 'mercadolibre-mcp',
    name: 'Mercado Libre',
    description: 'Official MCP server for Latin America\'s largest marketplace. Manage listings, orders, and seller operations.',
    category: 'E-commerce',
    tools: ['Listings', 'Orders', 'Seller Tools', 'Marketplace'],
    status: 'official',
    url: 'https://github.com/mercadolibre/mcp-server-mercadolibre'
  },

  // ─── Analytics & Monitoring ───────────────────────────────────────

  {
    id: 'grafana-mcp',
    name: 'Grafana',
    description: 'Search dashboards, investigate incidents, and query datasources. Monitor systems and analyze observability data.',
    category: 'Analytics & Monitoring',
    tools: ['Dashboards', 'Incidents', 'Datasources', 'Alerting'],
    status: 'official',
    url: 'https://github.com/grafana/mcp-grafana'
  },
  {
    id: 'datadog-mcp',
    name: 'Datadog',
    description: 'Access monitoring, incidents, logs, dashboards, and metrics. Bridge observability data with AI for intelligent debugging.',
    category: 'Analytics & Monitoring',
    tools: ['Metrics', 'Logs', 'Dashboards', 'Incidents', 'APM'],
    status: 'official',
    url: 'https://docs.datadoghq.com/bits_ai/mcp_server/'
  },
  {
    id: 'axiom-mcp',
    name: 'Axiom',
    description: 'Query and analyze logs, traces, and event data in natural language. Investigate production issues with observability data.',
    category: 'Analytics & Monitoring',
    tools: ['Logs', 'Traces', 'Events', 'Natural Language Query'],
    status: 'official',
    url: 'https://github.com/axiomhq/mcp-server-axiom'
  },
  {
    id: 'amplitude-mcp',
    name: 'Amplitude',
    description: 'Integrate AI with product analytics data. Search, analyze charts, dashboards, experiments, and metrics.',
    category: 'Analytics & Monitoring',
    tools: ['Charts', 'Dashboards', 'Experiments', 'Metrics'],
    status: 'official',
    url: 'https://github.com/nicholasgriffintn/amplitude-mcp'
  },
  {
    id: 'new-relic-mcp',
    name: 'New Relic',
    description: 'Monitoring, NRQL queries, dashboards, and incident management. Analyze application performance and infrastructure health.',
    category: 'Analytics & Monitoring',
    tools: ['NRQL', 'APM', 'Dashboards', 'Infrastructure', 'Incidents'],
    status: 'community',
    url: 'https://github.com/nicholasgriffintn/newrelic-mcp'
  },
  {
    id: 'pagerduty-mcp',
    name: 'PagerDuty',
    description: 'Manage incidents, services, schedules, and escalation policies from AI-enabled clients.',
    category: 'Analytics & Monitoring',
    tools: ['Incidents', 'Services', 'Schedules', 'Escalations'],
    status: 'community',
    url: 'https://github.com/nicholasgriffintn/pagerduty-mcp'
  },
  {
    id: 'raygun-mcp',
    name: 'Raygun',
    description: 'Crash reporting and real user monitoring. Debug errors and analyze user experience metrics.',
    category: 'Analytics & Monitoring',
    tools: ['Crash Reporting', 'RUM', 'Error Tracking', 'Performance'],
    status: 'official',
    url: 'https://github.com/nicholasgriffintn/raygun-mcp'
  },
  {
    id: 'logfire-mcp',
    name: 'Logfire',
    description: 'Access OpenTelemetry traces and metrics through Pydantic Logfire. Analyze distributed systems.',
    category: 'Analytics & Monitoring',
    tools: ['Traces', 'Metrics', 'OpenTelemetry', 'Debugging'],
    status: 'official',
    url: 'https://github.com/pydantic/logfire-mcp'
  },
  {
    id: 'agentops-mcp',
    name: 'AgentOps',
    description: 'Observability and tracing for AI agents. Debug agent workflows, track tool usage, and monitor performance.',
    category: 'Analytics & Monitoring',
    tools: ['Agent Tracing', 'Debugging', 'Performance', 'Tool Usage'],
    status: 'official',
    url: 'https://github.com/AgentOps-AI/agentops-mcp'
  },
  {
    id: 'ilert-mcp',
    name: 'ilert',
    description: 'Incident management, on-call scheduling, and alert routing through natural language.',
    category: 'Analytics & Monitoring',
    tools: ['Incidents', 'On-Call', 'Alerts', 'Status Pages'],
    status: 'official',
    url: 'https://github.com/iLert/ilert-mcp'
  },

  // ─── Design & Creative ────────────────────────────────────────────

  {
    id: 'figma-mcp',
    name: 'Figma',
    description: 'Official Figma Dev Mode MCP server. Extract layouts, styles, and component structures for AI-informed code generation.',
    category: 'Design & Creative',
    tools: ['Design Data', 'Components', 'Styles', 'Layout'],
    status: 'official',
    url: 'https://www.figma.com/blog/introducing-figma-mcp-server/'
  },
  {
    id: '21st-dev-mcp',
    name: '21st.dev Magic',
    description: 'Create crafted UI components inspired by top design engineers. Production-ready React components from descriptions.',
    category: 'Design & Creative',
    tools: ['UI Components', 'React', 'Design System', 'Code Generation'],
    status: 'official',
    url: 'https://github.com/21st-dev/magic-mcp'
  },
  {
    id: 'mermaid-mcp',
    name: 'Mermaid',
    description: 'Generate Mermaid diagrams with 22+ types. Flowcharts, sequence diagrams, and architecture visualizations from text.',
    category: 'Design & Creative',
    tools: ['Flowcharts', 'Sequence Diagrams', 'Architecture', 'Visualization'],
    status: 'community',
    url: 'https://github.com/nicholasgriffintn/mermaid-mcp'
  },
  {
    id: 'excalidraw-mcp',
    name: 'Excalidraw',
    description: 'Generate architecture diagrams and whiteboard sketches from natural language descriptions.',
    category: 'Design & Creative',
    tools: ['Diagrams', 'Whiteboard', 'Architecture', 'Sketches'],
    status: 'community',
    url: 'https://github.com/nicholasgriffintn/excalidraw-mcp'
  },
  {
    id: 'slidespeak-mcp',
    name: 'SlideSpeak',
    description: 'Create presentations and PowerPoint slides using AI. Generate professional decks from content descriptions.',
    category: 'Design & Creative',
    tools: ['Presentations', 'PowerPoint', 'Slides', 'Templates'],
    status: 'community',
    url: 'https://github.com/nicholasgriffintn/slidespeak-mcp'
  },

  // ─── Marketing ────────────────────────────────────────────────────

  {
    id: 'audiense-mcp',
    name: 'Audiense Insights',
    description: 'Marketing insights and audience analysis. Demographics, cultural affinities, and social media behavior for campaigns.',
    category: 'Marketing',
    tools: ['Audience Analysis', 'Demographics', 'Social Insights', 'Segmentation'],
    status: 'official',
    url: 'https://github.com/AudienseConnect/mcp-audiense-insights'
  },
  {
    id: 'fetchserp-mcp',
    name: 'FetchSERP',
    description: 'All-in-one SEO and web intelligence toolkit. Track rankings, analyze SERPs, and optimize search presence.',
    category: 'Marketing',
    tools: ['SEO', 'SERP Analysis', 'Rankings', 'Web Intelligence'],
    status: 'official',
    url: 'https://github.com/nicholasgriffintn/fetchserp-mcp'
  },
  {
    id: 'supadata-mcp',
    name: 'Supadata',
    description: 'Access YouTube, TikTok, X (Twitter), and web data. Extract social media content for marketing intelligence.',
    category: 'Marketing',
    tools: ['YouTube', 'TikTok', 'Twitter/X', 'Social Analytics'],
    status: 'official',
    url: 'https://github.com/nicholasgriffintn/supadata-mcp'
  },

  // ─── Search & Knowledge ───────────────────────────────────────────

  {
    id: 'exa-mcp',
    name: 'Exa',
    description: 'Search engine built for AI. High-quality, structured search results optimized for LLM consumption.',
    category: 'Search & Knowledge',
    tools: ['Web Search', 'Content Extraction', 'Semantic Search', 'Filtering'],
    status: 'official',
    url: 'https://github.com/exa-labs/exa-mcp-server'
  },
  {
    id: 'tavily-mcp',
    name: 'Tavily',
    description: 'AI-optimized search engine for research and information retrieval. Structured results for AI agents.',
    category: 'Search & Knowledge',
    tools: ['Search', 'Research', 'Content Extraction', 'Structured Results'],
    status: 'official',
    url: 'https://github.com/tavily-ai/tavily-mcp'
  },
  {
    id: 'brave-search-mcp',
    name: 'Brave Search',
    description: 'Search the web using Brave\'s independent search index. Web and local search without tracking.',
    category: 'Search & Knowledge',
    tools: ['Web Search', 'Local Search', 'News', 'Results'],
    status: 'official',
    url: 'https://github.com/nicholasgriffintn/brave-search-mcp'
  },
  {
    id: 'kagi-mcp',
    name: 'Kagi Search',
    description: 'Premium, ad-free search API. High-quality results without tracking or SEO spam.',
    category: 'Search & Knowledge',
    tools: ['Web Search', 'Summaries', 'Fast Answers', 'Research'],
    status: 'official',
    url: 'https://github.com/nicholasgriffintn/kagi-mcp'
  },
  {
    id: 'meilisearch-mcp',
    name: 'Meilisearch',
    description: 'Lightning-fast full-text and semantic search. Manage indexes and query documents.',
    category: 'Search & Knowledge',
    tools: ['Full-Text Search', 'Semantic Search', 'Indexes', 'Filters'],
    status: 'official',
    url: 'https://github.com/meilisearch/meilisearch-mcp'
  },
  {
    id: 'context7-mcp',
    name: 'Context7',
    description: 'Up-to-date documentation for any coding framework. Version-specific docs injected directly into AI prompts.',
    category: 'Search & Knowledge',
    tools: ['Documentation', 'Framework Docs', 'Version-Specific', 'Code Context'],
    status: 'community',
    url: 'https://github.com/nicholasgriffintn/context7-mcp'
  },
  {
    id: 'graphlit-mcp',
    name: 'Graphlit',
    description: 'Ingest content from Slack, Gmail, podcasts, and web sources into a searchable knowledge graph.',
    category: 'Search & Knowledge',
    tools: ['Content Ingestion', 'Knowledge Graph', 'Search', 'Multi-Source'],
    status: 'official',
    url: 'https://github.com/graphlit/graphlit-mcp-server'
  },

  // ─── Web Scraping & Data Extraction ───────────────────────────────

  {
    id: 'firecrawl-mcp',
    name: 'Firecrawl',
    description: 'Powerful web scraping and data extraction. Crawl websites, extract structured data, and convert pages to markdown.',
    category: 'Web Scraping & Data Extraction',
    tools: ['Web Crawling', 'Data Extraction', 'Markdown Conversion', 'Structured Data'],
    status: 'official',
    url: 'https://github.com/mendableai/firecrawl-mcp-server'
  },
  {
    id: 'apify-mcp',
    name: 'Apify',
    description: 'Access 6,000+ pre-built cloud scrapers and automation tools. Extract data from any website at scale.',
    category: 'Web Scraping & Data Extraction',
    tools: ['Web Scraping', 'Automation', 'Data Extraction', 'Actors'],
    status: 'official',
    url: 'https://github.com/apify/actors-mcp-server'
  },
  {
    id: 'bright-data-mcp',
    name: 'Bright Data',
    description: 'Discover, extract, and interact with web data. Enterprise-grade web intelligence at scale.',
    category: 'Web Scraping & Data Extraction',
    tools: ['Web Scraping', 'Proxies', 'Data Collection', 'Unblocking'],
    status: 'official',
    url: 'https://github.com/nicholasgriffintn/bright-data-mcp'
  },
  {
    id: 'browserbase-mcp',
    name: 'Browserbase',
    description: 'Automate browser interactions in the cloud. Run headless browsers at scale for web scraping and testing.',
    category: 'Web Scraping & Data Extraction',
    tools: ['Cloud Browsers', 'Automation', 'Data Extraction', 'Screenshots'],
    status: 'official',
    url: 'https://github.com/nicholasgriffintn/browserbase-mcp'
  },
  {
    id: 'fetch-mcp',
    name: 'Fetch',
    description: 'Web content fetching and conversion. Retrieve and process web pages into AI-friendly formats.',
    category: 'Web Scraping & Data Extraction',
    tools: ['URL Fetching', 'Content Conversion', 'Markdown', 'Web Access'],
    status: 'official',
    url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/fetch'
  },

  // ─── Security ─────────────────────────────────────────────────────

  {
    id: 'auth0-mcp',
    name: 'Auth0',
    description: 'Interact with your Auth0 tenant. Manage applications, actions, forms, logs, and authentication configurations.',
    category: 'Security',
    tools: ['Applications', 'Actions', 'Logs', 'Authentication'],
    status: 'official',
    url: 'https://github.com/auth0/auth0-mcp-server'
  },
  {
    id: 'cycode-mcp',
    name: 'Cycode',
    description: 'SAST, SCA, secrets detection, and IaC scanning. Comprehensive application security from a single platform.',
    category: 'Security',
    tools: ['SAST', 'SCA', 'Secrets Detection', 'IaC Scanning'],
    status: 'official',
    url: 'https://github.com/cycodelabs/cycode-mcp'
  },
  {
    id: 'asgardeo-mcp',
    name: 'Asgardeo',
    description: 'Identity and access management. Manage users, applications, and authentication flows.',
    category: 'Security',
    tools: ['Identity Management', 'SSO', 'Applications', 'Users'],
    status: 'official',
    url: 'https://github.com/nicholasgriffintn/asgardeo-mcp'
  },

  // ─── Cloud Infrastructure ─────────────────────────────────────────

  {
    id: 'aiven-mcp',
    name: 'Aiven',
    description: 'Navigate Aiven projects and managed PostgreSQL, Kafka, ClickHouse, and OpenSearch services across cloud providers.',
    category: 'Cloud Infrastructure',
    tools: ['PostgreSQL', 'Kafka', 'ClickHouse', 'OpenSearch'],
    status: 'official',
    url: 'https://github.com/aiven/aiven-mcp-server'
  },
  {
    id: 'hostinger-mcp',
    name: 'Hostinger',
    description: 'Official Hostinger API MCP server for managing hosting services, domains, and website configurations.',
    category: 'Cloud Infrastructure',
    tools: ['Hosting', 'Domains', 'DNS', 'Configuration'],
    status: 'official',
    url: 'https://github.com/nicholasgriffintn/hostinger-mcp'
  },

  // ─── Automation & Integration ─────────────────────────────────────

  {
    id: 'make-mcp',
    name: 'Make',
    description: 'Turn Make (Integromat) scenarios into callable tools. Trigger complex multi-step automations through natural language.',
    category: 'Automation & Integration',
    tools: ['Scenarios', 'Triggers', 'Automations', 'Multi-Step Workflows'],
    status: 'official',
    url: 'https://github.com/integromat/make-mcp-server'
  },
  {
    id: 'n8n-mcp',
    name: 'n8n',
    description: 'AI-powered workflow automation. Create, manage, and monitor n8n workflows with 400+ integrations.',
    category: 'Automation & Integration',
    tools: ['Workflows', 'Integrations', 'Triggers', 'Automation'],
    status: 'community',
    url: 'https://github.com/nicholasgriffintn/n8n-mcp'
  },
  {
    id: 'paragon-mcp',
    name: 'Paragon ActionKit',
    description: 'Connect to 130+ SaaS integrations through a unified API. Pre-built connectors for enterprise tools.',
    category: 'Automation & Integration',
    tools: ['130+ Integrations', 'Unified API', 'Connectors', 'Workflows'],
    status: 'official',
    url: 'https://github.com/nicholasgriffintn/paragon-mcp'
  },

  // ─── Maps & Location ──────────────────────────────────────────────

  {
    id: 'google-maps-mcp',
    name: 'Google Maps',
    description: 'Geocoding, directions, place search, and location-based services. Geospatial intelligence for AI.',
    category: 'Maps & Location',
    tools: ['Geocoding', 'Directions', 'Places', 'Distance Matrix'],
    status: 'official',
    url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/google-maps'
  },
  {
    id: 'mapbox-mcp',
    name: 'Mapbox',
    description: 'Unlock geospatial intelligence through Mapbox APIs. Maps, geocoding, navigation, and spatial analysis.',
    category: 'Maps & Location',
    tools: ['Maps', 'Geocoding', 'Navigation', 'Spatial Analysis'],
    status: 'official',
    url: 'https://github.com/nicholasgriffintn/mapbox-mcp'
  },

  // ─── Productivity ─────────────────────────────────────────────────

  {
    id: 'obsidian-mcp',
    name: 'Obsidian',
    description: 'Intelligent vault context management with frontmatter filtering, chunking, and bidirectional knowledge operations.',
    category: 'Productivity',
    tools: ['Notes', 'Knowledge Base', 'Vault Search', 'Bidirectional Links'],
    status: 'community',
    url: 'https://github.com/nicholasgriffintn/obsidian-mcp'
  },
  {
    id: 'anytype-mcp',
    name: 'Anytype',
    description: 'Local-first collaborative wiki. Organize objects, lists, and knowledge in a privacy-focused workspace.',
    category: 'Productivity',
    tools: ['Wiki', 'Objects', 'Lists', 'Collaboration'],
    status: 'official',
    url: 'https://github.com/nicholasgriffintn/anytype-mcp'
  },

  // ─── Customer Support ─────────────────────────────────────────────

  {
    id: 'zendesk-mcp',
    name: 'Zendesk',
    description: 'Manage support tickets, customer interactions, and help center articles. Triage and respond to inquiries.',
    category: 'Customer Support',
    tools: ['Tickets', 'Customers', 'Help Center', 'Comments'],
    status: 'community',
    url: 'https://github.com/nicholasgriffintn/zendesk-mcp'
  },
  {
    id: 'freshdesk-mcp',
    name: 'Freshdesk',
    description: 'Manage tickets, contacts, agents, and conversations. Automate customer support workflows.',
    category: 'Customer Support',
    tools: ['Tickets', 'Contacts', 'Agents', 'Conversations'],
    status: 'community',
    url: 'https://github.com/nicholasgriffintn/freshdesk-mcp'
  },

  // ─── Content Management ───────────────────────────────────────────

  {
    id: 'kontent-ai-mcp',
    name: 'Kontent.ai',
    description: 'Create, manage, and explore content models in Kontent.ai headless CMS. Automate content operations.',
    category: 'Content Management',
    tools: ['Content', 'Models', 'Publishing', 'Assets'],
    status: 'official',
    url: 'https://github.com/nicholasgriffintn/kontent-ai-mcp'
  },
  {
    id: 'box-mcp',
    name: 'Box',
    description: 'Intelligent content management. Search files, manage folders, and leverage Box AI for content understanding.',
    category: 'Content Management',
    tools: ['Files', 'Folders', 'Search', 'Box AI'],
    status: 'community',
    url: 'https://github.com/nicholasgriffintn/box-mcp'
  },

  // ─── HR & Recruitment ─────────────────────────────────────────────

  {
    id: 'coresignal-mcp',
    name: 'Coresignal',
    description: 'Comprehensive B2B data on companies, employees, and job postings. Talent intelligence and market research.',
    category: 'HR & Recruitment',
    tools: ['Company Data', 'Employee Data', 'Job Postings', 'Market Intelligence'],
    status: 'official',
    url: 'https://github.com/nicholasgriffintn/coresignal-mcp'
  },

  // ─── Legal & Compliance ───────────────────────────────────────────

  {
    id: 'esignatures-mcp',
    name: 'eSignatures',
    description: 'Contract and template management for drafting, review, and electronic signing. Automate document workflows.',
    category: 'Legal & Compliance',
    tools: ['Contracts', 'Templates', 'Signing', 'Document Management'],
    status: 'official',
    url: 'https://github.com/nicholasgriffintn/esignatures-mcp'
  },

  // ─── Data Governance & BI ─────────────────────────────────────────

  {
    id: 'atlan-mcp',
    name: 'Atlan',
    description: 'Bring metadata power to your AI tools. Navigate data catalogs, understand lineage, and enforce governance.',
    category: 'Data Governance & BI',
    tools: ['Data Catalog', 'Lineage', 'Governance', 'Metadata'],
    status: 'official',
    url: 'https://github.com/nicholasgriffintn/atlan-mcp'
  },

  // ─── Healthcare ───────────────────────────────────────────────────

  {
    id: 'fhir-mcp',
    name: 'FHIR',
    description: 'Fast Healthcare Interoperability Resources APIs. Access patient data, clinical records, and healthcare systems.',
    category: 'Healthcare',
    tools: ['Patient Data', 'Clinical Records', 'SMART-on-FHIR', 'Interoperability'],
    status: 'official',
    url: 'https://github.com/nicholasgriffintn/fhir-mcp'
  },

  // ─── Media & Entertainment ────────────────────────────────────────

  {
    id: 'mux-mcp',
    name: 'Mux',
    description: 'Video API for upload, streaming, thumbnails, and captions. Build video-powered applications.',
    category: 'Media & Entertainment',
    tools: ['Video Upload', 'Streaming', 'Thumbnails', 'Captions'],
    status: 'official',
    url: 'https://github.com/nicholasgriffintn/mux-mcp'
  },
  {
    id: 'tldv-mcp',
    name: 'tl;dv',
    description: 'Connect to Google Meet, Zoom, and Teams recordings. Transcribe meetings and extract insights.',
    category: 'Media & Entertainment',
    tools: ['Meeting Recordings', 'Transcription', 'Insights', 'Search'],
    status: 'official',
    url: 'https://github.com/nicholasgriffintn/tldv-mcp'
  },

  // ─── Travel & Logistics ───────────────────────────────────────────

  {
    id: 'kiwi-mcp',
    name: 'Kiwi.com',
    description: 'Official Kiwi.com flight search MCP server. Find flights, compare prices, and access travel data.',
    category: 'Travel & Logistics',
    tools: ['Flight Search', 'Prices', 'Routes', 'Booking'],
    status: 'official',
    url: 'https://github.com/nicholasgriffintn/kiwi-mcp'
  },

  // ─── IoT & Smart Home ─────────────────────────────────────────────

  {
    id: 'aqara-mcp',
    name: 'Aqara',
    description: 'Control Aqara smart home devices, query status, and execute scenes. Automate home environments.',
    category: 'IoT & Smart Home',
    tools: ['Devices', 'Scenes', 'Status', 'Automation'],
    status: 'official',
    url: 'https://github.com/nicholasgriffintn/aqara-mcp'
  },

  // ─── Blockchain & Crypto ──────────────────────────────────────────

  {
    id: 'thirdweb-mcp',
    name: 'Thirdweb',
    description: 'Read and write to over 2,000 blockchains. Deploy contracts, manage wallets, and interact with Web3.',
    category: 'Blockchain & Crypto',
    tools: ['Smart Contracts', 'Wallets', 'Multi-Chain', 'NFTs'],
    status: 'official',
    url: 'https://github.com/thirdweb-dev/mcp-server'
  },

  // ─── Networking & Utilities ───────────────────────────────────────

  {
    id: 'filesystem-mcp',
    name: 'Filesystem',
    description: 'Secure file operations with configurable access controls. Read, write, search, and manage local files.',
    category: 'Networking & Utilities',
    tools: ['File Read', 'File Write', 'Search', 'Directory Management'],
    status: 'official',
    url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/filesystem'
  },
  {
    id: 'time-mcp',
    name: 'Time',
    description: 'Time and timezone conversion. Get current time, convert between timezones, and perform date calculations.',
    category: 'Networking & Utilities',
    tools: ['Current Time', 'Timezone Conversion', 'Date Math'],
    status: 'official',
    url: 'https://github.com/modelcontextprotocol/servers/tree/main/src/time'
  },

  // ─── Workflow & Approvals ─────────────────────────────────────────

  {
    id: 'gotohuman-mcp',
    name: 'gotoHuman',
    description: 'Human-in-the-loop platform for approval requests. Route AI decisions to humans when oversight is needed.',
    category: 'Workflow & Approvals',
    tools: ['Approvals', 'Human Review', 'Routing', 'Escalation'],
    status: 'official',
    url: 'https://github.com/nicholasgriffintn/gotohuman-mcp'
  },
  {
    id: 'growthbook-mcp',
    name: 'GrowthBook',
    description: 'Create and manage feature flags and experiments. Run A/B tests and review results with AI analysis.',
    category: 'Workflow & Approvals',
    tools: ['Feature Flags', 'Experiments', 'A/B Testing', 'Analytics'],
    status: 'official',
    url: 'https://github.com/nicholasgriffintn/growthbook-mcp'
  },

  // ─── Education ────────────────────────────────────────────────────

  {
    id: 'edubase-mcp',
    name: 'EduBase',
    description: 'Interact with the EduBase e-learning platform. Manage courses, quizzes, and educational content.',
    category: 'Education',
    tools: ['Courses', 'Quizzes', 'Content', 'Learning'],
    status: 'official',
    url: 'https://github.com/nicholasgriffintn/edubase-mcp'
  },

  // ─── SME tools (August 2026 research batch) ───────────────────────

  {
    id: 'google-analytics-mcp',
    name: 'Google Analytics',
    description: 'Pull GA4 data on demand: run standard, funnel, and realtime reports, list accounts and properties, and retrieve custom dimensions and metrics. Read-only, maintained by Google.',
    category: 'Analytics & Monitoring',
    tools: ['Reports', 'Funnel Analysis', 'Realtime Traffic', 'Property Lookup'],
    status: 'official',
    url: 'https://github.com/googleanalytics/google-analytics-mcp'
  },
  {
    id: 'mixpanel-mcp',
    name: 'Mixpanel',
    description: 'Answer product-usage questions from real Mixpanel data — run insights, funnel, flow, and retention analyses, build dashboards, and review session replays.',
    category: 'Analytics & Monitoring',
    tools: ['Funnels & Retention', 'Dashboards', 'Events & Cohorts', 'Session Replay'],
    status: 'official',
    url: 'https://docs.mixpanel.com/docs/mcp'
  },
  {
    id: 'posthog-mcp',
    name: 'PostHog',
    description: 'Query product analytics with HogQL, manage feature flags and experiments, investigate errors with stack traces, and triage issues directly in PostHog.',
    category: 'Analytics & Monitoring',
    tools: ['Analytics Queries', 'Feature Flags', 'Error Tracking', 'Experiments'],
    status: 'official',
    url: 'https://posthog.com/docs/model-context-protocol'
  },
  {
    id: 'zapier-mcp',
    name: 'Zapier',
    description: 'Take real actions across 9,000+ business apps — send messages, create tasks, update CRM records, and run workflows — through Zapier\'s hosted MCP endpoint.',
    category: 'Automation & Integration',
    tools: ['App Actions', '9,000+ Integrations', 'Tool Discovery', 'Workflow Automation'],
    status: 'official',
    url: 'https://docs.zapier.com/mcp/home'
  },
  {
    id: 'attio-mcp',
    name: 'Attio',
    description: 'Search, read, and update CRM records — people, companies, deals, tasks, and notes — plus run reports and semantic search across emails and call recordings in Attio.',
    category: 'Business Tools',
    tools: ['Record Search', 'Pipeline Management', 'Notes & Tasks', 'Reporting'],
    status: 'official',
    url: 'https://docs.attio.com/mcp/overview'
  },
  {
    id: 'cal-com-mcp',
    name: 'Cal.com',
    description: 'Manage Cal.com scheduling by natural language — view bookings, reschedule, check open slots, and edit event types. Hosted or self-hosted with 34 tools.',
    category: 'Business Tools',
    tools: ['Bookings', 'Rescheduling', 'Availability', 'Event Types'],
    status: 'official',
    url: 'https://cal.com/docs/mcp-server'
  },
  {
    id: 'calendly-mcp',
    name: 'Calendly',
    description: 'Check availability, generate scheduling links, and book or cancel meetings in Calendly. Runs as a fully hosted server with OAuth sign-in and no credential setup.',
    category: 'Business Tools',
    tools: ['Availability', 'Scheduling Links', 'Booking', 'Event Types'],
    status: 'official',
    url: 'https://developer.calendly.com/calendly-mcp-server'
  },
  {
    id: 'close-mcp',
    name: 'Close',
    description: 'Pull leads, opportunities, and activity data from Close CRM, update records, and create new leads through natural-language prompts.',
    category: 'Business Tools',
    tools: ['Lead Management', 'Opportunity Tracking', 'Activity History', 'Record Updates'],
    status: 'official',
    url: 'https://close.com/integrations/close-mcp'
  },
  {
    id: 'jotform-mcp',
    name: 'Jotform',
    description: 'Create forms and review submissions in Jotform through conversational commands, with an interactive app mode showing form previews inside AI clients.',
    category: 'Business Tools',
    tools: ['Form Creation', 'Submissions', 'Previews', 'Workflow Automation'],
    status: 'official',
    url: 'https://www.jotform.com/developers/mcp/'
  },
  {
    id: 'typeform-mcp',
    name: 'Typeform',
    description: 'Build and publish forms, manage contacts and lists, set up automation workflows, and analyse form responses in Typeform.',
    category: 'Business Tools',
    tools: ['Form Building', 'Contact Management', 'Automations', 'Response Analysis'],
    status: 'official',
    url: 'https://www.typeform.com/developers/get-started/mcp/'
  },
  {
    id: 'fathom-mcp',
    name: 'Fathom',
    description: 'Search and summarise recorded meetings — pulling transcripts, summaries, and action items from Fathom to draft follow-ups and answer questions about past calls.',
    category: 'Communication',
    tools: ['Meeting Search', 'Transcripts', 'Summaries', 'Action Items'],
    status: 'official',
    url: 'https://developers.fathom.ai/mcp-docs'
  },
  {
    id: 'postmark-mcp',
    name: 'Postmark',
    description: 'Send single and batch transactional emails, manage and validate templates, search message history, and diagnose delivery failures, bounces, and suppressions in Postmark.',
    category: 'Communication',
    tools: ['Email Sending', 'Templates', 'Delivery Diagnostics', 'Suppressions'],
    status: 'official',
    url: 'https://github.com/ActiveCampaign/postmark-mcp'
  },
  {
    id: 'resend-mcp',
    name: 'Resend',
    description: 'Send and schedule emails, manage contacts and audience segments, create broadcasts and templates, build automations, and configure sending domains in Resend.',
    category: 'Communication',
    tools: ['Email Sending', 'Audience Management', 'Broadcasts', 'Automations', 'Domains'],
    status: 'official',
    url: 'https://resend.com/docs/mcp-server'
  },
  {
    id: 'zoom-mcp',
    name: 'Zoom',
    description: 'Schedule Zoom meetings, send chat messages, and pull meeting summaries, notes, and action items into other tools via Zoom\'s product-area MCP servers.',
    category: 'Communication',
    tools: ['Meeting Scheduling', 'Chat', 'Summaries', 'Action Items'],
    status: 'official',
    url: 'https://developers.zoom.us/docs/mcp/'
  },
  {
    id: 'contentful-mcp',
    name: 'Contentful',
    description: 'Manage the full Contentful content lifecycle — create and edit entries, manage assets and content types, bulk publish, and invoke AI Actions across spaces.',
    category: 'Content Management',
    tools: ['Entry Editing', 'Content Types', 'Asset Management', 'Bulk Publishing'],
    status: 'official',
    url: 'https://github.com/contentful/contentful-mcp-server'
  },
  {
    id: 'sanity-mcp',
    name: 'Sanity',
    description: 'Create, patch, and publish Sanity content with full schema awareness, run GROQ queries and semantic search, and manage releases and datasets.',
    category: 'Content Management',
    tools: ['Document Editing', 'GROQ Queries', 'Release Management', 'Semantic Search'],
    status: 'official',
    url: 'https://www.sanity.io/docs/ai/mcp-server'
  },
  {
    id: 'storyblok-mcp',
    name: 'Storyblok',
    description: 'Create stories, update and publish entries, and manage assets in Storyblok by discovering and executing Management API operations through a hosted MCP endpoint.',
    category: 'Content Management',
    tools: ['Story Creation', 'Publishing', 'Asset Management', 'API Operations'],
    status: 'official',
    url: 'https://www.storyblok.com/docs/libraries/mcp-server'
  },
  {
    id: 'strapi-mcp',
    name: 'Strapi',
    description: 'Create, read, update, publish, and unpublish content in a Strapi CMS through auto-generated CRUD tools per content type, with permission enforcement built in.',
    category: 'Content Management',
    tools: ['Content CRUD', 'Publishing', 'Filtering', 'Localisation'],
    status: 'official',
    url: 'https://docs.strapi.io/cms/features/strapi-mcp-server'
  },
  {
    id: 'webflow-mcp',
    name: 'Webflow',
    description: 'Build and manage Webflow sites: create and update CMS collections and items, edit page content, and manage site publishing through Webflow\'s Data API.',
    category: 'Content Management',
    tools: ['CMS Collections', 'Page Editing', 'Site Publishing', 'Design Elements'],
    status: 'official',
    url: 'https://github.com/webflow/mcp-server'
  },
  {
    id: 'wordpress-mcp',
    name: 'WordPress',
    description: 'Manage a WordPress site remotely — posts, pages, and site content via the WordPress REST API, with optional WooCommerce support. Maintained by Automattic.',
    category: 'Content Management',
    tools: ['Posts & Pages', 'REST API Access', 'Site Administration', 'WooCommerce'],
    status: 'official',
    url: 'https://github.com/Automattic/mcp-wordpress-remote'
  },
  {
    id: 'front-mcp',
    name: 'Front',
    description: 'Search and triage Front conversations, draft and send replies, post internal comments, manage tags and assignments, and look up contacts and accounts.',
    category: 'Customer Support',
    tools: ['Conversation Triage', 'Reply Drafting', 'Comments', 'Tags & Assignments'],
    status: 'official',
    url: 'https://dev.frontapp.com/docs/mcp-server'
  },
  {
    id: 'help-scout-mcp',
    name: 'Help Scout',
    description: 'Search Help Scout conversations, customers, and Docs knowledge base to summarise customer history, spot patterns, and pull support reports — respecting existing user permissions.',
    category: 'Customer Support',
    tools: ['Conversation Search', 'Customer Context', 'Docs Queries', 'Support Trends'],
    status: 'official',
    url: 'https://articles.helpscout.com/blog/introducing-help-scout-mcp/'
  },
  {
    id: 'canva-mcp',
    name: 'Canva',
    description: 'Create Canva designs from text descriptions, edit and search existing designs, upload assets, use brand kit resources, and export to PDF, PNG, PPTX, or MP4.',
    category: 'Design & Creative',
    tools: ['Design Creation', 'Design Search', 'Asset Upload', 'Brand Kit', 'Export'],
    status: 'official',
    url: 'https://www.canva.dev/docs/mcp/'
  },
  {
    id: 'bigcommerce-storefront-mcp',
    name: 'BigCommerce Storefront',
    description: 'Act as a shopping agent on a BigCommerce store — search the product catalogue, retrieve product details, build and manage carts, and generate checkout URLs.',
    category: 'E-commerce',
    tools: ['Catalogue Search', 'Product Details', 'Cart Management', 'Checkout URLs'],
    status: 'official',
    url: 'https://www.bigcommerce.com/blog/storefront-mcp/'
  },
  {
    id: 'wix-mcp',
    name: 'Wix',
    description: 'Manage Wix sites and make live API calls on them — listing sites, performing site-level actions, and searching Wix documentation to build on the platform.',
    category: 'E-commerce',
    tools: ['Site APIs', 'Site Management', 'Docs Search', 'Headless Commerce'],
    status: 'official',
    url: 'https://dev.wix.com/docs/sdk/articles/use-the-wix-mcp/about-the-wix-mcp'
  },
  {
    id: 'bill-com-mcp',
    name: 'Bill.com',
    description: 'Manage accounts payable and receivable — bills, invoices, vendors, customers, and payments — plus corporate card spend and budgets via the Spend & Expense API.',
    category: 'Finance & Accounting',
    tools: ['Accounts Payable', 'Accounts Receivable', 'Vendors', 'Spend Management'],
    status: 'community',
    url: 'https://github.com/civicteam/bill-mcp-server'
  },
  {
    id: 'brex-mcp',
    name: 'Brex',
    description: 'Review card expenses, transactions, budgets, spend limits, and statements, upload receipts, and update expense records — suited to spend analysis and expense hygiene.',
    category: 'Finance & Accounting',
    tools: ['Card Expenses', 'Budgets', 'Transactions', 'Statements'],
    status: 'community',
    url: 'https://github.com/crazyrabbitLTC/mcp-brex-server'
  },
  {
    id: 'expensify-mcp',
    name: 'Expensify',
    description: 'Search and analyse live expenses, receipts, reports, and invoices in natural language. Read-only by design, so the AI can audit spend and approval states but never move money.',
    category: 'Finance & Accounting',
    tools: ['Expense Search', 'Receipts', 'Report Analysis', 'Spend Auditing'],
    status: 'official',
    url: 'https://use.expensify.com/blog/expensify-mcp'
  },
  {
    id: 'freeagent-mcp',
    name: 'FreeAgent',
    description: 'List bank transactions, explain and reconcile them with receipts, create expense claims, and log mileage at HMRC rates — a practical bookkeeping assistant for UK freelancers and small companies.',
    category: 'Finance & Accounting',
    tools: ['Reconciliation', 'Bank Transactions', 'Expenses', 'HMRC Mileage'],
    status: 'community',
    url: 'https://github.com/oxygenbubbles/freeagent-mcp-server'
  },
  {
    id: 'freshbooks-mcp',
    name: 'FreshBooks',
    description: 'List and retrieve invoices, payments, expenses, clients, and projects, and manage time entries — 24 tools covering the day-to-day admin of a service business.',
    category: 'Finance & Accounting',
    tools: ['Invoicing', 'Time Tracking', 'Expenses', 'Clients'],
    status: 'community',
    url: 'https://github.com/bitovi/freshbooks-mcp-server'
  },
  {
    id: 'gocardless-mcp',
    name: 'GoCardless',
    description: 'Query payment statuses, customers, mandates, and subscriptions, and create payments or issue refunds with user confirmation. A strong fit for UK businesses collecting by Direct Debit.',
    category: 'Finance & Accounting',
    tools: ['Direct Debit', 'Payments', 'Mandates', 'Subscriptions', 'Refunds'],
    status: 'official',
    url: 'https://developer.gocardless.com/developer-tools/mcp/'
  },
  {
    id: 'mercury-mcp',
    name: 'Mercury',
    description: 'Query business bank balances, transaction history, and account data in natural language, with OAuth sign-in and read-only access so the AI can analyse cash without moving money.',
    category: 'Finance & Accounting',
    tools: ['Banking', 'Balances', 'Transactions', 'Cash Analysis'],
    status: 'official',
    url: 'https://docs.mercury.com/docs/connecting-mercury-mcp'
  },
  {
    id: 'plaid-mcp',
    name: 'Plaid',
    description: 'Diagnose Plaid Items, pull Link conversion and error metrics, and check API usage from an AI assistant, with sandbox tokens and webhook simulation for building bank-data integrations.',
    category: 'Finance & Accounting',
    tools: ['Bank Data', 'Item Diagnostics', 'Link Analytics', 'Sandbox Testing'],
    status: 'official',
    url: 'https://plaid.com/docs/resources/mcp/'
  },
  {
    id: 'wise-mcp',
    name: 'Wise',
    description: 'List recipients, look up transfer requirements, create recipients, and send international payments through the Wise API, with sandbox support for personal and business profiles.',
    category: 'Finance & Accounting',
    tools: ['International Transfers', 'Recipients', 'Payments', 'Sandbox Testing'],
    status: 'community',
    url: 'https://github.com/sergeiledvanov/mcp-wise'
  },
  {
    id: 'zoho-books-mcp',
    name: 'Zoho Books',
    description: 'Create and send invoices, record expenses, reconcile bank transactions, chase overdue invoices with payment reminders, and pull P&L or revenue reports by prompt.',
    category: 'Finance & Accounting',
    tools: ['Invoicing', 'Expenses', 'Reconciliation', 'Reports', 'Payment Reminders'],
    status: 'official',
    url: 'https://www.zoho.com/us/books/help/mcp/zoho-books-mcp.html'
  },
  {
    id: 'factorial-mcp',
    name: 'Factorial',
    description: 'Clock employees in and out, request time off, check shift status, search colleagues, and answer company HR questions from Factorial, respecting user permissions.',
    category: 'HR & Recruitment',
    tools: ['Time Tracking', 'Time Off', 'Shifts', 'Employee Directory'],
    status: 'official',
    url: 'https://help.factorialhr.com/en_US/one/factorial-mcp-%E2%80%94-connect-one-to-chatgpt-claude-or-any-mcp-compatible-ai-assistant'
  },
  {
    id: 'gusto-mcp',
    name: 'Gusto',
    description: 'Answer payroll and HR questions from your Gusto account — payroll runs, deadlines, tax liability, employee records, and time off — via 36 read-only tools that can never run payroll or move money.',
    category: 'HR & Recruitment',
    tools: ['Payroll Queries', 'Employee Records', 'Pay Schedules', 'Leave Balances'],
    status: 'official',
    url: 'https://docs.gusto.com/app-integrations/docs/mcp'
  },
  {
    id: 'ahrefs-mcp',
    name: 'Ahrefs',
    description: 'Do keyword research, backlink audits, competitor traffic analysis, and content gap analysis with live Ahrefs data. Included on all paid Ahrefs plans.',
    category: 'Marketing',
    tools: ['Keyword Research', 'Backlink Audits', 'Traffic Analysis', 'Content Gaps'],
    status: 'official',
    url: 'https://ahrefs.com/mcp/'
  },
  {
    id: 'brevo-mcp',
    name: 'Brevo',
    description: 'Manage contacts and lists, create email, SMS, and WhatsApp campaigns, and work sales deals and pipelines inside Brevo.',
    category: 'Marketing',
    tools: ['Contact Management', 'Campaign Creation', 'Deal Pipeline', 'Templates'],
    status: 'official',
    url: 'https://developers.brevo.com/docs/mcp-protocol'
  },
  {
    id: 'dataforseo-mcp',
    name: 'DataForSEO',
    description: 'Pull real-time SERP results, keyword data, backlink profiles, on-page audits, and competitor domain analytics from DataForSEO\'s APIs.',
    category: 'Marketing',
    tools: ['SERP Data', 'Keyword Metrics', 'Backlink Analysis', 'On-Page Audits'],
    status: 'official',
    url: 'https://github.com/dataforseo/mcp-server-typescript'
  },
  {
    id: 'klaviyo-mcp',
    name: 'Klaviyo',
    description: 'Report on campaign and flow performance, inspect and segment customer profiles, and create email templates directly from live Klaviyo account data.',
    category: 'Marketing',
    tools: ['Campaign Reporting', 'Segmentation', 'Flow Analytics', 'Email Templates'],
    status: 'official',
    url: 'https://developers.klaviyo.com/en/docs/klaviyo_mcp_server'
  },
  {
    id: 'semrush-mcp',
    name: 'Semrush',
    description: 'Run keyword research, domain overviews, competitor analysis, and backlink research using live Semrush SEO and market-trends data.',
    category: 'Marketing',
    tools: ['Keyword Research', 'Domain Overview', 'Competitor Analysis', 'Backlinks'],
    status: 'official',
    url: 'https://developer.semrush.com/api/v4/introduction/semrush-mcp/'
  },
  {
    id: 'monday-com-mcp',
    name: 'Monday.com',
    description: 'Create and update boards, items, groups, and columns in monday.com, search work data, and post updates. Maintained by the monday.com AI team.',
    category: 'Productivity',
    tools: ['Items & Boards', 'Columns', 'Search', 'Updates'],
    status: 'official',
    url: 'https://github.com/mondaycom/mcp'
  },
  {
    id: 'smartsheet-mcp',
    name: 'Smartsheet',
    description: 'Query, analyse, and update live Smartsheet data — sheets, rows, reports, comments, and workspaces — respecting each user\'s permissions.',
    category: 'Productivity',
    tools: ['Sheet Queries', 'Row Updates', 'Reports', 'Sharing'],
    status: 'official',
    url: 'https://developers.smartsheet.com/ai-mcp/smartsheet/mcp-server'
  },
  {
    id: 'docusign-mcp',
    name: 'DocuSign',
    description: 'Create, send, and track agreements and query signature status through Docusign\'s Intelligent Agreement Management platform, connecting via OAuth with no API key setup.',
    category: 'Workflow & Approvals',
    tools: ['Send Agreements', 'Envelope Tracking', 'Agreement Data', 'Workflows'],
    status: 'official',
    url: 'https://developers.docusign.com/platform/mcp-server/'
  },
  {
    id: 'pandadoc-mcp',
    name: 'PandaDoc',
    description: 'Create, populate, and send PandaDoc documents — contracts, proposals, and NDAs — plus update variables and search agreements from a prompt.',
    category: 'Workflow & Approvals',
    tools: ['Document Creation', 'E-Signature', 'Variables', 'Agreement Search'],
    status: 'official',
    url: 'https://developers.pandadoc.com/docs/use-pandadoc-mcp-server'
  }
];

export const categories = Array.from(new Set(servers.map(s => s.category))).sort();
