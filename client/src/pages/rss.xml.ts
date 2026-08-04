import { blogPosts } from '../content/blogPosts';
import { learnPosts } from '../content/learnPosts';

const SITE = 'https://crox.io';

const escapeXml = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

export function GET() {
  const items = [
    ...blogPosts.map((p) => ({
      title: p.title,
      description: p.description,
      link: `${SITE}/insights/${p.slug}`,
      dateISO: p.dateISO || '2025-01-01',
    })),
    ...learnPosts.map((p) => ({
      title: p.title,
      description: p.description,
      link: `${SITE}/learn/${p.slug}`,
      dateISO: p.dateISO,
    })),
  ].sort((a, b) => b.dateISO.localeCompare(a.dateISO));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Crox — Practical AI for SMEs</title>
    <link>${SITE}</link>
    <description>Guides and insights on putting AI to work in small and mid-sized businesses: automation, MCP integrations, costs, and governance.</description>
    <language>en-gb</language>
    <atom:link href="${SITE}/rss.xml" rel="self" type="application/rss+xml"/>
${items
  .map(
    (i) => `    <item>
      <title>${escapeXml(i.title)}</title>
      <link>${i.link}</link>
      <guid>${i.link}</guid>
      <pubDate>${new Date(`${i.dateISO}T09:00:00Z`).toUTCString()}</pubDate>
      <description>${escapeXml(i.description)}</description>
    </item>`
  )
  .join('\n')}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' },
  });
}
