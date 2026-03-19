import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

interface ContentLayoutProps {
  title: string;
  subtitle: string;
  date: string;
  readTime: string;
  section: 'blog' | 'learn';
  children: React.ReactNode;
  slug?: string;
  tags?: string[];
  dateISO?: string;
  meta?: {
    description: string;
    canonical?: string;
    ogImage?: string;
  };
}

export const ContentLayout: React.FC<ContentLayoutProps> = ({
  title,
  subtitle,
  date,
  readTime,
  section,
  children,
  slug,
  tags,
  dateISO,
  meta,
}) => {
  const sectionLabel = section === 'blog' ? 'Blog' : 'Learn';
  const sectionPath = section === 'blog' ? '/blog' : '/learn';
  const baseUrl = 'https://crox.io';
  const canonicalUrl = meta?.canonical ? `${baseUrl}${meta.canonical}` : undefined;

  // JSON-LD schemas
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: meta?.description || subtitle,
    datePublished: dateISO || new Date().toISOString().split('T')[0],
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
    url: canonicalUrl || `${baseUrl}${meta?.canonical || '/'}`,
    keywords: tags?.join(', ') || '',
  };

  const breadcrumbItems = [
    { position: 1, name: 'Home', item: baseUrl },
    { position: 2, name: sectionLabel, item: `${baseUrl}${sectionPath}` },
    { position: 3, name: title, item: canonicalUrl || `${baseUrl}${meta?.canonical || '/'}` },
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
        <title>{title} — Crox</title>
        <meta name="description" content={meta?.description || subtitle} />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
        <meta name="author" content="Adam Field" />
        {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
        <meta property="og:title" content={title} />
        <meta property="og:description" content={meta?.description || subtitle} />
        <meta property="og:type" content="article" />
        <meta property="og:site_name" content="Crox" />
        {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
        {meta?.ogImage && <meta property="og:image" content={meta.ogImage} />}
        {dateISO && <meta property="article:published_time" content={dateISO} />}
        <meta property="article:author" content="Adam Field" />
        {tags && tags.length > 0 && <meta property="article:tag" content={tags.join(', ')} />}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={meta?.description || subtitle} />
        <script type="application/ld+json">
          {JSON.stringify(articleSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      <article className="w-full max-w-[900px] mx-auto px-4 sm:px-6 py-16 sm:py-24">
        {/* Breadcrumb Navigation */}
        <nav className="mb-12 text-[0.85rem] text-fg-dim">
          <Link to="/" className="text-fg border-b border-border pb-px hover:border-accent transition-colors">
            Home
          </Link>
          <span className="mx-3">/</span>
          <Link to={sectionPath} className="text-fg border-b border-border pb-px hover:border-accent transition-colors">
            {sectionLabel}
          </Link>
          <span className="mx-3">/</span>
          <span>{title}</span>
        </nav>

        {/* Article Header */}
        <header className="mb-12">
          <h1 className="font-serif font-normal text-[3.2rem] leading-[1.15] text-fg mb-4">
            {title}
          </h1>
          <p className="text-[1.1rem] text-fg-dim mb-6">{subtitle}</p>

          <div className="flex flex-wrap items-center gap-6 text-[0.85rem] text-fg-dim border-t border-border pt-6">
            <div>
              <span className="text-fg-dim">Published</span>
              <span className="ml-2">{date}</span>
            </div>
            <div>
              <span className="text-fg-dim">Read time</span>
              <span className="ml-2">{readTime}</span>
            </div>
          </div>
        </header>

        {/* Article Body */}
        <div className="prose prose-invert max-w-none mb-16">
          {children}
        </div>

        {/* Bottom CTA Section */}
        <div className="bg-surface border border-border rounded-none p-8 sm:p-10 mb-16">
          <h3 className="font-serif font-normal text-[1.6rem] text-fg mb-4">
            Ready to integrate AI into your business?
          </h3>
          <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
            See how Model Context Protocol (MCP) can connect your AI assistant to all your business tools. Book a call with our team to discuss your specific needs.
          </p>
          <a
            href="https://calendar.app.google/3avUXyXnctfWpyHF7"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block font-mono text-[0.8rem] font-medium tracking-[0.15em] uppercase text-fg bg-accent px-10 py-4 hover:opacity-90 transition-opacity"
          >
            Book a Call
          </a>
        </div>

        {/* More from Section */}
        <div className="border-t border-border pt-12">
          <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim mb-8 flex items-center gap-4">
            More from {sectionLabel}
            <span className="flex-1 h-px bg-border" />
          </div>
          <p className="text-[0.95rem] text-fg-dim">
            Explore more insights and guides in our {sectionLabel.toLowerCase()} section.
          </p>
          <Link
            to={sectionPath}
            className="inline-block mt-4 font-mono text-[0.8rem] font-medium tracking-[0.15em] uppercase text-fg border-b border-border pb-px hover:border-accent transition-colors"
          >
            View All {sectionLabel} Posts
          </Link>
        </div>
      </article>
    </>
  );
};
