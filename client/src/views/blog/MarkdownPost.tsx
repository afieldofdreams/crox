import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const bodyText = 'text-[0.95rem] text-fg-dim leading-[1.8]';

/** Renders an insights article from a markdown file in
 * src/content/insights/<slug>.md, styled to match the hand-built
 * post components so markdown-published pieces are indistinguishable. */
export const MarkdownPost: React.FC<{ content: string }> = ({ content }) => (
  <div className="space-y-6">
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p: ({ children }) => <p className={bodyText}>{children}</p>,
        strong: ({ children }) => (
          <span className="text-fg font-medium">{children}</span>
        ),
        h2: ({ children }) => (
          <h2 className="font-serif font-normal text-[1.6rem] text-fg mt-12 mb-2">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-[1.1rem] text-fg font-medium mt-8 mb-2">
            {children}
          </h3>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-accent pl-6 my-8 text-fg italic font-serif text-[1.1rem]">
            {children}
          </blockquote>
        ),
        ul: ({ children }) => (
          <ul className={`${bodyText} list-disc pl-6 space-y-2`}>{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className={`${bodyText} list-decimal pl-6 space-y-2`}>{children}</ol>
        ),
        a: ({ href, children }) => (
          <a
            href={href}
            className="text-fg border-b border-border pb-px hover:border-accent transition-colors"
          >
            {children}
          </a>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  </div>
);
