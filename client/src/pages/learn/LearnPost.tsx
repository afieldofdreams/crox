import React from "react";
import { useParams, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { learnPosts } from "../../content/learnPosts";
import WhatIsMcpPost from "./WhatIsMcpPost";
import McpVsApisPost from "./McpVsApisPost";
import McpArchitecturePost from "./McpArchitecturePost";

interface ContentLayoutProps {
  post: (typeof learnPosts)[0];
  children: React.ReactNode;
}

const ContentLayout: React.FC<ContentLayoutProps> = ({ post, children }) => {
  const baseUrl = 'https://crox.io';
  const canonicalUrl = `${baseUrl}/learn/${post.slug}`;
  const sectionLabel = 'Learn';

  // JSON-LD schemas
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.dateISO,
    author: {
      '@type': 'Person',
      name: 'Adam Field',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Crox',
      logo: {
        '@type': 'ImageObject',
        url: `${baseUrl}/logo.png`,
      },
    },
    url: canonicalUrl,
    keywords: post.tags.join(', '),
  };

  const breadcrumbItems = [
    { position: 1, name: 'Home', item: baseUrl },
    { position: 2, name: sectionLabel, item: `${baseUrl}/learn` },
    { position: 3, name: post.title, item: canonicalUrl },
  ];

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbItems.map(item => ({
      '@type': 'ListItem',
      position: item.position,
      name: item.name,
      item: item.item,
    })),
  };

  return (
    <>
      <Helmet>
        <title>{post.title} | Learn | crox</title>
        <meta name="description" content={post.description} />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
        <meta name="author" content="Adam Field" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.description} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Crox" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="article:published_time" content={post.dateISO} />
        <meta property="article:author" content="Adam Field" />
        <meta property="article:tag" content={post.tags.join(", ")} />
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      <main className="w-full">
        <section className="w-full px-6 py-16 flex items-center justify-center border-b border-border">
          <div className="w-full max-w-[900px]">
            <div className="mb-8">
              <a
                href="/learn"
                className="text-accent hover:text-fg transition-colors text-[0.9rem] font-mono"
              >
                ← Back to Learn
              </a>
            </div>
            <h1 className="font-serif font-normal text-[3.2rem] leading-[1.15] text-fg mb-4">
              {post.title}
            </h1>
            {post.subtitle && (
              <p className="text-[1.1rem] text-accent mb-8">
                {post.subtitle}
              </p>
            )}
            <div className="flex items-center gap-6 text-[0.85rem] text-fg-dim font-mono">
              <span>{post.date}</span>
              <span className="w-px h-4 bg-border" />
              <span>{post.readTime}</span>
              <span className="w-px h-4 bg-border" />
              <div className="flex gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 border border-border text-fg-dim text-[0.75rem] uppercase tracking-wide"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="w-full px-6 py-16 flex items-center justify-center">
          <div className="w-full max-w-[900px]">
            {children}
          </div>
        </section>

        {/* Related Content CTA */}
        <section className="w-full px-6 py-24 flex items-center justify-center border-t border-border bg-surface/30">
          <div className="w-full max-w-[900px]">
            <div className="flex flex-col items-center text-center">
              <p className="text-[1rem] text-fg-dim leading-[1.8] mb-8 max-w-[600px]">
                Ready to implement these concepts in your organization? Our team can guide you through the entire MCP integration process.
              </p>
              <a
                href="/ai-integration"
                className="px-8 py-4 bg-accent text-[#0a0a0a] font-mono text-[0.9rem] font-medium hover:opacity-90 transition-opacity"
              >
                Schedule a Consultation
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

const LearnPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = learnPosts.find((p) => p.slug === slug);

  if (!post) {
    return <Navigate to="/learn" replace />;
  }

  const renderContent = () => {
    switch (slug) {
      case "what-is-mcp":
        return <WhatIsMcpPost />;
      case "mcp-vs-apis-vs-plugins":
        return <McpVsApisPost />;
      case "mcp-architecture-explained":
        return <McpArchitecturePost />;
      default:
        return <Navigate to="/learn" replace />;
    }
  };

  return (
    <ContentLayout post={post}>
      {renderContent()}
    </ContentLayout>
  );
};

export default LearnPost;
