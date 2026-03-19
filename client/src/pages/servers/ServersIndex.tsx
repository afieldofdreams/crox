import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { servers, categories } from '../../content/servers';

const BOOKING_URL = 'https://calendar.app.google/3avUXyXnctfWpyHF7';

function ServersIndex() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const baseUrl = 'https://crox.io';
  const canonicalUrl = `${baseUrl}/servers`;

  const filteredServers = useMemo(() => {
    return servers.filter(server => {
      const matchesSearch =
        server.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        server.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        server.tools.some(tool =>
          tool.toLowerCase().includes(searchQuery.toLowerCase())
        );

      const matchesCategory = !selectedCategory || server.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  // JSON-LD schemas
  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'MCP Server Directory | Crox',
    description: 'Explore 20+ MCP servers that extend Claude\'s capabilities.',
    url: canonicalUrl,
    isPartOf: {
      '@type': 'Website',
      name: 'Crox',
      url: baseUrl,
    },
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: baseUrl },
      { '@type': 'ListItem', position: 2, name: 'Servers', item: canonicalUrl },
    ],
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'MCP Servers',
    url: canonicalUrl,
    itemListElement: filteredServers.map((server, index) => ({
      '@type': 'SoftwareApplication',
      position: index + 1,
      name: server.name,
      description: server.description,
      applicationCategory: 'DeveloperApplication',
      offers: {
        '@type': 'Offer',
        availability: 'https://schema.org/InStock',
      },
    })),
  };

  return (
    <>
      <Helmet>
        <title>MCP Server Directory | Crox</title>
        <meta name="description" content="Explore 20+ MCP servers that extend Claude's capabilities. Connect to Slack, GitHub, Salesforce, Stripe, Notion, and more." />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="MCP Server Directory | Crox" />
        <meta property="og:description" content="Find integrations for AI-powered automation. Official, community, and custom MCP servers." />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Crox" />
        <meta property="og:url" content={canonicalUrl} />
        <script type="application/ld+json">
          {JSON.stringify(collectionPageSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(itemListSchema)}
        </script>
      </Helmet>

      <div className="min-h-screen bg-[#0a0a0a] text-[#e8e4de]">
        <div className="max-w-content mx-auto px-6 py-16">
          {/* Hero Section */}
          <div className="mb-16">
            <h1 className="font-serif text-5xl mb-4 text-[#e8e4de]">
              MCP Server Directory
            </h1>
            <p className="text-[0.95rem] text-[#d0cbc5] leading-[1.8] max-w-2xl">
              Explore the MCP servers that extend Claude's capabilities. Connect to your tools, data, and workflows. This is a reference guide to what's possible when AI can reach beyond the chat interface.
            </p>
          </div>

          {/* Search and Filter Section */}
          <div className="mb-12">
            <div className="mb-6">
              <input
                type="text"
                placeholder="Search servers, tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 bg-[#141414] border border-[#333333] rounded text-[#e8e4de] placeholder-[#d0cbc5] focus:outline-none focus:border-[#e05a3a] transition-colors text-[0.95rem]"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 text-[0.85rem] font-mono rounded transition-colors ${
                  selectedCategory === null
                    ? 'bg-[#e05a3a] text-[#0a0a0a]'
                    : 'border border-[#333333] text-[#d0cbc5] hover:border-[#e05a3a] hover:text-[#e05a3a]'
                }`}
              >
                All
              </button>
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 text-[0.85rem] font-mono rounded transition-colors ${
                    selectedCategory === category
                      ? 'bg-[#e05a3a] text-[#0a0a0a]'
                      : 'border border-[#333333] text-[#d0cbc5] hover:border-[#e05a3a] hover:text-[#e05a3a]'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6 text-[#d0cbc5] text-[0.85rem]">
            Showing {filteredServers.length} of {servers.length} servers
          </div>

          {/* Server Cards Grid */}
          <div className="grid gap-6 mb-16">
            {filteredServers.map(server => (
              <div
                key={server.id}
                className="bg-[#141414] border border-[#333333] rounded p-6 hover:border-[#e05a3a] transition-colors"
              >
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-3">
                  <div>
                    <h2 className="font-serif text-xl text-[#e8e4de] mb-1">
                      {server.name}
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-2 items-start">
                    <span className="text-[0.75rem] font-mono px-3 py-1 rounded border border-[#333333] text-[#d0cbc5]">
                      {server.category}
                    </span>
                    {server.status === 'official' && (
                      <span className="text-[0.75rem] font-mono px-3 py-1 rounded border border-[#e05a3a] text-[#e05a3a]">
                        Official
                      </span>
                    )}
                    {server.status === 'community' && (
                      <span className="text-[0.75rem] font-mono px-3 py-1 rounded border border-[#333333] text-[#d0cbc5]">
                        Community
                      </span>
                    )}
                    {server.status === 'custom' && (
                      <span className="text-[0.75rem] font-mono px-3 py-1 rounded bg-[#e05a3a] text-[#0a0a0a]">
                        We build this
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-[0.95rem] text-[#d0cbc5] leading-[1.8] mb-4">
                  {server.description}
                </p>

                <div className="mb-4">
                  <div className="text-[0.75rem] text-[#d0cbc5] uppercase tracking-[0.1em] mb-2">
                    Capabilities
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {server.tools.map((tool, idx) => (
                      <span
                        key={idx}
                        className="text-[0.8rem] px-2 py-1 bg-[#0a0a0a] border border-[#333333] rounded text-[#d0cbc5]"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex gap-4 pt-2 border-t border-[#333333]">
                  {server.relatedBlogSlug && (
                    <Link
                      to={`/blog/${server.relatedBlogSlug}`}
                      className="text-[0.85rem] text-[#e05a3a] hover:text-[#e8e4de] transition-colors"
                    >
                      Read blog →
                    </Link>
                  )}
                  {server.relatedLearnSlug && (
                    <Link
                      to={`/learn/${server.relatedLearnSlug}`}
                      className="text-[0.85rem] text-[#e05a3a] hover:text-[#e8e4de] transition-colors"
                    >
                      Learn more →
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredServers.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[#d0cbc5] text-[0.95rem] mb-2">
                No servers match your search.
              </p>
              <p className="text-[#d0cbc5] text-[0.85rem]">
                Try adjusting your filters or search terms.
              </p>
            </div>
          )}

          {/* CTA Section */}
          <div className="border-t border-[#333333] pt-12">
            <div className="max-w-2xl">
              <div className="text-[0.7rem] tracking-[0.2em] uppercase text-[#d0cbc5] mb-4">
                Custom Integrations
              </div>
              <h2 className="font-serif text-2xl text-[#e8e4de] mb-4">
                Don't see what you need?
              </h2>
              <p className="text-[0.95rem] text-[#d0cbc5] leading-[1.8] mb-6">
                Crox builds custom MCP servers tailored to your specific tools and workflows. Whether it's a proprietary system, legacy database, or niche SaaS platform, we can create connectors that let Claude integrate with your entire tech stack.
              </p>
              <div className="flex gap-4">
                <Link
                  to="/ai-integration"
                  className="inline-block px-6 py-3 bg-[#e05a3a] text-[#0a0a0a] font-mono text-[0.9rem] rounded hover:bg-[#d84d2f] transition-colors"
                >
                  Explore Custom Builds
                </Link>
                <a
                  href={BOOKING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-6 py-3 border border-[#e05a3a] text-[#e05a3a] font-mono text-[0.9rem] rounded hover:bg-[#e05a3a] hover:text-[#0a0a0a] transition-colors"
                >
                  Schedule a Call
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ServersIndex;
