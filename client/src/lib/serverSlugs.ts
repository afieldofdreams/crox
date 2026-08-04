import { servers, categories, type MCPServerEntry } from '../content/servers';

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(/&/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const categorySlug = (category: string) => slugify(category);
export const serverSlug = (server: MCPServerEntry) => slugify(server.name);

export function categoryFromSlug(slug: string): string | undefined {
  return categories.find((c) => categorySlug(c) === slug);
}

export function serverFromSlug(slug: string): MCPServerEntry | undefined {
  return servers.find((s) => serverSlug(s) === slug);
}

/** Category pages and server pages share the /servers/[slug] namespace, so a
 * server whose name slugifies to an existing category slug (or to another
 * server's slug) would silently shadow a page. Fail the build instead. */
export function assertNoSlugCollisions(): void {
  const seen = new Map<string, string>();
  for (const c of categories) {
    seen.set(categorySlug(c), `category "${c}"`);
  }
  for (const s of servers) {
    const slug = serverSlug(s);
    const existing = seen.get(slug);
    if (existing) {
      throw new Error(
        `Slug collision under /servers/: server "${s.name}" (${slug}) vs ${existing}`
      );
    }
    seen.set(slug, `server "${s.name}"`);
  }
}
