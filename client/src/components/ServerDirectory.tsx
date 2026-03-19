import { useState, useMemo } from 'react';
import { servers, categories, type MCPServerEntry } from '../content/servers';

export default function ServerDirectory() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

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

  return (
    <div>
      {/* Search and Filter */}
      <div className="mb-12">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search servers, tools, categories..."
            aria-label="Search servers"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 bg-surface border border-border rounded text-fg placeholder-fg-dim focus:outline-none focus:border-accent transition-colors text-[0.95rem]"
          />
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by category">
          <button
            onClick={() => setSelectedCategory(null)}
            aria-pressed={selectedCategory === null}
            className={`px-4 py-2 text-[0.85rem] font-mono rounded transition-colors ${
              selectedCategory === null
                ? 'bg-accent text-bg'
                : 'border border-border text-fg-dim hover:border-accent hover:text-accent'
            }`}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              aria-pressed={selectedCategory === category}
              className={`px-4 py-2 text-[0.85rem] font-mono rounded transition-colors ${
                selectedCategory === category
                  ? 'bg-accent text-bg'
                  : 'border border-border text-fg-dim hover:border-accent hover:text-accent'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6 text-fg-dim text-[0.85rem]" role="status" aria-live="polite">
        Showing {filteredServers.length} of {servers.length} servers
      </div>

      {/* Server Cards */}
      <div className="grid gap-6">
        {filteredServers.map(server => (
          <div
            key={server.id}
            className="bg-surface border border-border rounded p-6 hover:border-accent transition-colors"
          >
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-3">
              <h2 className="font-serif text-xl text-fg mb-1">
                {server.name}
              </h2>
              <div className="flex flex-wrap gap-2 items-start">
                <span className="text-[0.75rem] font-mono px-3 py-1 rounded border border-border text-fg-dim">
                  {server.category}
                </span>
                {server.status === 'official' && (
                  <span className="text-[0.75rem] font-mono px-3 py-1 rounded border border-accent text-accent">
                    Official
                  </span>
                )}
                {server.status === 'community' && (
                  <span className="text-[0.75rem] font-mono px-3 py-1 rounded border border-border text-fg-dim">
                    Community
                  </span>
                )}
                {server.status === 'custom' && (
                  <span className="text-[0.75rem] font-mono px-3 py-1 rounded bg-accent text-bg">
                    We build this
                  </span>
                )}
              </div>
            </div>

            <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-4">
              {server.description}
            </p>

            <div className="mb-4">
              <div className="text-[0.75rem] text-fg-dim uppercase tracking-[0.1em] mb-2">
                Capabilities
              </div>
              <div className="flex flex-wrap gap-2">
                {server.tools.map((tool, idx) => (
                  <span
                    key={idx}
                    className="text-[0.8rem] px-2 py-1 bg-bg border border-border rounded text-fg-dim"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {server.url && (
              <div className="pt-2 border-t border-border">
                <a
                  href={server.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[0.85rem] text-accent hover:text-fg transition-colors"
                >
                  View integration <span className="sr-only">(opens in a new tab)</span> →
                </a>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredServers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-fg-dim text-[0.95rem] mb-2">
            No servers match your search.
          </p>
          <p className="text-fg-dim text-[0.85rem]">
            Try adjusting your filters or search terms.
          </p>
        </div>
      )}
    </div>
  );
}
