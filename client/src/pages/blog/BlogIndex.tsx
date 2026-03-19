import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { blogPosts } from '../../content/blogPosts';

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'How do I connect ChatGPT to my accounting software?',
    answer:
      'You can connect ChatGPT to accounting software like Xero, QuickBooks, or FreshBooks using Model Context Protocol (MCP) servers. These act as bridges that let Claude access your financial data, create invoices, and reconcile accounts without direct API access.',
  },
  {
    question: 'Can AI access my business data safely?',
    answer:
      'Yes, with proper safeguards. MCP servers provide secure access patterns where AI only gets the data it needs, your credentials stay on your servers, and you maintain complete control over what information is shared. This is much safer than giving AI full database access.',
  },
  {
    question: 'What is the cheapest way to integrate AI with my small business tools?',
    answer:
      'Using existing MCP servers is the most cost-effective approach. Open-source servers for common tools are free, while custom integrations start around the cost of a few developer days. No expensive infrastructure or licensing required.',
  },
  {
    question: 'Do I need a developer to set up AI for my business?',
    answer:
      'Not necessarily. Many integrations can be configured through Claude itself or simple configuration files. For custom setups with proprietary systems, you might need a developer, but standard business tools typically work out of the box.',
  },
  {
    question: 'How long does it take to connect AI to Xero or HubSpot?',
    answer:
      'For standard integrations like Xero or HubSpot, you can get up and running in hours. Initial setup takes about 1-2 hours, then you can immediately start using Claude with your data. Complex workflows might take a day or two to optimize.',
  },
];

const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="mb-16">
      <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim mb-8 flex items-center gap-4">
        FAQ
        <span className="flex-1 h-px bg-border" />
      </div>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-border">
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-4 flex justify-between items-start hover:bg-surface/50 transition-colors"
            >
              <h3 className="text-[0.95rem] text-fg text-left font-medium">{faq.question}</h3>
              <span className="ml-4 text-fg-dim flex-shrink-0">
                {openIndex === index ? '−' : '+'}
              </span>
            </button>
            {openIndex === index && (
              <div className="border-t border-border px-6 py-4 bg-surface/30">
                <p className="text-[0.9rem] text-fg-dim leading-[1.6]">{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const BlogIndex: React.FC = () => {
  const baseUrl = 'https://crox.io';
  const canonicalUrl = `${baseUrl}/blog`;

  // JSON-LD schemas
  const collectionPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Blog — Crox',
    description: 'Insights and guides on AI integration for business.',
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
      { '@type': 'ListItem', position: 2, name: 'Blog', item: canonicalUrl },
    ],
  };

  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Blog Posts',
    url: canonicalUrl,
    itemListElement: blogPosts.map((post, index) => ({
      '@type': 'Article',
      position: index + 1,
      name: post.title,
      description: post.description,
      url: `${baseUrl}/blog/${post.slug}`,
    })),
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
  return (
    <>
      <Helmet>
        <title>Blog — Crox</title>
        <meta name="description" content="Insights and guides on AI integration for business. Learn how to safely connect AI to your tools." />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Blog — Crox" />
        <meta property="og:description" content="Insights and guides on AI integration for business." />
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
        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>
      </Helmet>

      <div className="w-full max-w-[900px] mx-auto px-4 sm:px-6 py-16 sm:py-24">
        {/* Hero Section */}
        <header className="mb-16">
          <div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim mb-6 flex items-center gap-4">
            Writing
            <span className="flex-1 h-px bg-border" />
          </div>
          <h1 className="font-serif font-normal text-[3.2rem] leading-[1.15] text-fg mb-4">
            Insights
          </h1>
          <p className="text-[1.1rem] text-fg-dim leading-[1.8]">
            Practical guides and analysis on integrating AI with your business tools. Learn how Model Context Protocol is making it safe and accessible for SMEs to connect their AI assistants to the systems they already use.
          </p>
        </header>

        {/* Blog Posts List */}
        <div className="space-y-8 mb-16">
          {blogPosts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="block group"
            >
              <article className="border border-border p-6 sm:p-8 hover:border-accent transition-colors duration-300 bg-surface/30">
                <div className="flex flex-col">
                  <h2 className="font-serif font-normal text-[1.6rem] text-fg group-hover:text-accent transition-colors mb-2">
                    {post.title}
                  </h2>
                  <p className="text-[0.95rem] text-fg-dim mb-4 leading-[1.6]">
                    {post.subtitle}
                  </p>

                  <div className="flex flex-wrap items-center gap-4 text-[0.8rem] text-fg-dim mb-4">
                    <span>{post.date}</span>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>

                  {post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-block text-[0.75rem] tracking-[0.1em] uppercase text-fg-dim border border-border/50 px-3 py-1"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </article>
            </Link>
          ))}
        </div>

        {/* FAQ Section */}
        <FAQ />

        {/* CTA Section */}
        <div className="bg-surface border border-border p-8 sm:p-10">
          <h3 className="font-serif font-normal text-[1.6rem] text-fg mb-4">
            Ready to implement AI in your business?
          </h3>
          <p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-6">
            Discuss how Model Context Protocol can safely connect your AI assistant to your business systems. Book a call with our team.
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
      </div>
    </>
  );
};

export default BlogIndex;
