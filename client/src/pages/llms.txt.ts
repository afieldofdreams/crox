import { blogPosts } from '../content/blogPosts';
import { learnPosts } from '../content/learnPosts';
import { servers, categories } from '../content/servers';

const SITE = 'https://crox.io';

// Generated at build time so post lists and directory counts can never
// drift from the site the way the old hand-maintained file did.
export function GET() {
  const byDate = <T extends { dateISO?: string }>(a: T, b: T) =>
    (b.dateISO || '').localeCompare(a.dateISO || '');

  const blog = [...blogPosts]
    .sort(byDate)
    .map((p) => `- ${p.title}: ${SITE}/insights/${p.slug}`)
    .join('\n');

  const learn = [...learnPosts]
    .sort(byDate)
    .map((p) => `- ${p.title}: ${SITE}/learn/${p.slug}`)
    .join('\n');

  const roundedCount = Math.floor(servers.length / 10) * 10;

  const body = `# Crox

> Practical AI for small and mid-sized businesses. It starts with a map of your business and a prioritised AI roadmap, then we build the tooling and support it as it grows.

Crox (crox.io, also known as Crox AI) is a UK company — Crox Ltd, Companies House number 10549400 — founded in 2017 by Adam Field and based in London. It is not connected to other similarly named businesses.

## What We Do

Crox helps SMEs put AI to work through one clear path: Map, Build, Support. AI Mapping produces a map of your processes, tools, and data plus a prioritised roadmap. Build turns the top opportunity into working tooling connected to your real systems with governance built in. Ongoing Support keeps the tooling working as models change and works down the rest of the roadmap. Deep experience in regulated industries (healthcare, legal, fintech, insurance).

## Services

- **AI Mapping** (Step 1): A three-week mapping of your processes, tools, data, and risk, producing a prioritised AI roadmap — what to automate first, what to fix first, what to leave alone. ${SITE}/mapping
- **Build / AI Experiments** (Step 2): A four-to-six-week engagement delivering a working AI version of one high-value process, connected to your real systems, governance built in. ${SITE}/experiments
- **Ongoing Development & Support** (Step 3): A month-to-month partnership — new tooling built down the roadmap, everything built kept working as models and APIs change, and time with your team. ${SITE}/support
- **Education**: Practical half- or full-day training for the people who will use AI day to day. ${SITE}/education
- **Board / Exec**: Briefings, working sessions, and ongoing guidance for leadership deciding what AI does in the organisation. ${SITE}/board-exec
- **MCP Server Directory**: Comprehensive directory of ${roundedCount}+ MCP servers across ${categories.length} categories, with a dedicated page per category and per server. ${SITE}/servers

## About

Founded by Adam Field. 10+ years building and deploying machine learning systems in regulated environments. Former AI product leader at Babylon Health (clinical AI across 12 countries), Health Navigator (NHS readmission reduction), and Forward Partners (FinTech scoring systems). Currently Head of Product at SideLight AI. Based in London, UK.

## Contact

- Email: adam@crox.io
- Website: ${SITE}

## Pages

- Home: ${SITE}/
- AI for SMEs — practical guide (pillar): ${SITE}/ai-for-smes
- About: ${SITE}/about
- AI Mapping: ${SITE}/mapping
- Build / AI Experiments: ${SITE}/experiments
- Ongoing Development & Support: ${SITE}/support
- AI Readiness Scorecard: ${SITE}/assessment
- MCP Server Directory: ${SITE}/servers
- Blog: ${SITE}/insights
- Learn: ${SITE}/learn
- RSS feed: ${SITE}/rss.xml

## Blog Posts

${blog}

## Learn

${learn}
`;

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
