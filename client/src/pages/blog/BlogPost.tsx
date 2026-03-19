import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { ContentLayout } from '../../components/ContentLayout';
import { getBlogPostBySlug } from '../../content/blogPosts';
import { ConnectAiPost } from './ConnectAiPost';
import { AiAccountingPost } from './AiAccountingPost';
import { AiCrmPost } from './AiCrmPost';
import { AiSavingTimePost } from './AiSavingTimePost';
import { AiLegalPost } from './AiLegalPost';

interface PostContent {
  component: React.ReactNode;
}

const postContentMap: Record<string, React.ReactNode> = {
  'connect-ai-to-business-tools': <ConnectAiPost />,
  'ai-for-accounting-firms': <AiAccountingPost />,
  'why-ai-cant-see-your-crm': <AiCrmPost />,
  'ai-saving-small-business-time': <AiSavingTimePost />,
  'ai-for-legal-practices': <AiLegalPost />,
};

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  if (!slug) {
    return <Navigate to="/blog" replace />;
  }

  const post = getBlogPostBySlug(slug);

  if (!post) {
    return <Navigate to="/blog" replace />;
  }

  const content = postContentMap[slug];

  if (!content) {
    return <Navigate to="/blog" replace />;
  }

  // Convert date string to ISO format (March 2026 -> 2026-03-15 default)
  const dateISO = post.dateISO || '2026-03-15';

  return (
    <ContentLayout
      title={post.title}
      subtitle={post.subtitle}
      date={post.date}
      readTime={post.readTime}
      section="blog"
      slug={slug}
      tags={post.tags}
      dateISO={dateISO}
      meta={{
        description: post.description,
        canonical: `/blog/${slug}`,
      }}
    >
      {content}
    </ContentLayout>
  );
};

export default BlogPost;
