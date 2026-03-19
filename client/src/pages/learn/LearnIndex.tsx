import React, { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { learnPosts } from "../../content/learnPosts";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "What is MCP in simple terms?",
    answer:
      "Model Context Protocol (MCP) is a standard way for AI assistants to ask for and receive information from different systems. Think of it as a standardized language that lets Claude talk to your business tools (Slack, CRM, databases) safely and securely.",
  },
  {
    question: "Is Model Context Protocol the same as an API?",
    answer:
      "No, they're different. APIs are technical interfaces that require developers to build custom integrations. MCP is higher-level and more standardized — it's designed so AI can use the same protocol with many different systems without custom coding.",
  },
  {
    question: "Do I need to know how MCP works to use it?",
    answer:
      "No. You don't need to understand the technical details. If you can use Claude, you can use an MCP server. Just connect it and start asking Claude questions about your data — it handles the complexity.",
  },
  {
    question: "Which AI assistants support MCP?",
    answer:
      "Claude (both web and desktop) natively supports MCP. Other AI assistants are adding support as the standard gains adoption. The Anthropic ecosystem has the deepest integration.",
  },
  {
    question: "Is MCP secure for business data?",
    answer:
      "Yes. MCP is designed with security as a core principle. Your credentials stay on your machines, data requests are controlled, and you can audit everything that happens. It's built for enterprise use.",
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
                {openIndex === index ? "−" : "+"}
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

const LearnIndex: React.FC = () => {
  const baseUrl = "https://crox.io";
  const canonicalUrl = `${baseUrl}/learn`;

  // JSON-LD schemas
  const collectionPageSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Learn | crox",
    description: "Technical authority on the Model Context Protocol and AI integration.",
    url: canonicalUrl,
    isPartOf: {
      "@type": "Website",
      name: "Crox",
      url: baseUrl,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: baseUrl },
      { "@type": "ListItem", position: 2, name: "Learn", item: canonicalUrl },
    ],
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Learn Posts",
    url: canonicalUrl,
    itemListElement: learnPosts.map((post, index) => ({
      "@type": "Article",
      position: index + 1,
      name: post.title,
      description: post.description,
      url: `${baseUrl}/learn/${post.slug}`,
    })),
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
  return (
    <>
      <Helmet>
        <title>Learn | crox — AI Integration at Scale</title>
        <meta
          name="description"
          content="Technical authority on the Model Context Protocol and AI integration. Deep dives into MCP architecture, implementation patterns, and business strategy."
        />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Learn | crox" />
        <meta
          property="og:description"
          content="Technical reference for understanding MCP and building connected AI systems."
        />
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

      <main className="w-full">
        {/* Hero Section */}
        <section className="w-full px-6 py-24 flex items-center justify-center">
          <div className="w-full max-w-[900px]">
            <h1 className="font-serif font-normal text-[3.2rem] leading-[1.15] text-fg mb-6">
              Learn
            </h1>
            <p className="text-[1.1rem] text-fg-dim leading-[1.8] max-w-[600px]">
              Understanding the technology behind connected AI systems. Our technical reference for the Model Context Protocol—the open standard reshaping how businesses integrate AI with their tools.
            </p>
          </div>
        </section>

        {/* Posts Grid */}
        <section className="w-full px-6 py-16 flex items-center justify-center border-t border-border">
          <div className="w-full max-w-[900px]">
            <div className="grid gap-12">
              {learnPosts.map((post) => (
                <Link
                  key={post.slug}
                  to={`/learn/${post.slug}`}
                  className="group block border border-border p-8 hover:border-accent transition-colors duration-300 hover:bg-surface/50"
                >
                  <div className="flex items-start justify-between gap-6">
                    <div className="flex-1 min-w-0">
                      <h2 className="font-serif font-normal text-[1.6rem] leading-[1.2] text-fg mb-2 group-hover:text-accent transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-accent text-[0.9rem] mb-4">
                        {post.subtitle}
                      </p>
                      <p className="text-[0.95rem] text-fg-dim leading-[1.6] mb-6">
                        {post.description}
                      </p>
                      <div className="flex items-center gap-6 text-[0.8rem] text-fg-dim">
                        <span>{post.date}</span>
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="text-accent text-[1.2rem] opacity-0 group-hover:opacity-100 transition-opacity">
                        →
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="w-full px-6 py-16 flex items-center justify-center border-t border-border">
          <div className="w-full max-w-[900px]">
            <FAQ />
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full px-6 py-24 flex items-center justify-center border-t border-border bg-surface/30">
          <div className="w-full max-w-[900px]">
            <div className="flex flex-col items-center text-center">
              <p className="text-[1.1rem] text-fg-dim leading-[1.8] mb-8 max-w-[600px]">
                Looking for a deeper partnership? We handle the integration and implementation so you can focus on deploying AI at scale.
              </p>
              <Link
                to="/ai-integration"
                className="px-8 py-4 bg-accent text-[#0a0a0a] font-mono text-[0.9rem] font-medium hover:opacity-90 transition-opacity"
              >
                Explore AI Integration Services
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
};

export default LearnIndex;
