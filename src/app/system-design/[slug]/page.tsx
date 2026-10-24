import { notFound } from 'next/navigation';
import Link from 'next/link';
import {
  systemDesignTopics,
  getSystemDesignTopicBySlug,
  getRelatedTopics,
} from '@/data/systemDesign';
import ArchFlow from '@/components/ArchFlow';
import BookmarkButton from '@/components/BookmarkButton';
import ProgressTracker from '@/components/ProgressTracker';
import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Lightbulb,
  Workflow,
  AlertTriangle,
  MessageSquareWarning,
  Network,
} from 'lucide-react';
import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site-config';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return systemDesignTopics.map((t) => ({ slug: t.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const topic = getSystemDesignTopicBySlug(slug);
  if (!topic) return { title: 'Topic Not Found' };

  const title = `${topic.title} — System Design`;
  const description = `${topic.summary} Architecture walkthrough, trade-offs, common pitfalls, and interview tips.`;
  const ogImageUrl = `/api/og?title=${encodeURIComponent(topic.title)}&subtitle=${encodeURIComponent(topic.summary)}&type=default`;

  return {
    title,
    description,
    keywords: [topic.title, 'System Design', topic.category, ...topic.tags],
    alternates: { canonical: `${siteConfig.url}/system-design/${slug}` },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/system-design/${slug}`,
      siteName: siteConfig.name,
      type: 'article',
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: topic.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

const difficultyColor: Record<string, string> = {
  Easy: 'text-green-400',
  Medium: 'text-yellow-400',
  Hard: 'text-red-400',
};

export default async function SystemDesignDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const topic = getSystemDesignTopicBySlug(slug);

  if (!topic) {
    notFound();
  }

  const sameType = systemDesignTopics.filter((t) => t.type === topic.type);
  const currentIndex = sameType.findIndex((t) => t.slug === slug);
  const prevTopic = currentIndex > 0 ? sameType[currentIndex - 1] : null;
  const nextTopic = currentIndex < sameType.length - 1 ? sameType[currentIndex + 1] : null;

  const related = getRelatedTopics(topic);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${siteConfig.url}/system-design/${slug}`,
        headline: topic.title,
        description: topic.summary,
        author: { '@type': 'Organization', name: siteConfig.name },
        publisher: { '@type': 'Organization', name: siteConfig.name },
        url: `${siteConfig.url}/system-design/${slug}`,
        keywords: topic.tags.join(', '),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
          { '@type': 'ListItem', position: 2, name: 'System Design', item: `${siteConfig.url}/system-design` },
          { '@type': 'ListItem', position: 3, name: topic.title, item: `${siteConfig.url}/system-design/${slug}` },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
          <Link href="/system-design" className="flex items-center gap-1.5 hover:text-zinc-200 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            System Design
          </Link>
          <span>/</span>
          <span className="text-cyan-400">{topic.type === 'fundamental' ? 'Fundamentals' : 'Case Study'}</span>
          <span>/</span>
          <span className="text-zinc-300">{topic.title}</span>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-sm font-medium text-cyan-400">
                  {topic.category}
                </span>
                {topic.difficulty && (
                  <span className={`text-sm font-medium ${difficultyColor[topic.difficulty]}`}>
                    {topic.difficulty}
                  </span>
                )}
              </div>
              <h1 className="mb-3 text-3xl font-bold text-white">{topic.title}</h1>
              <p className="text-zinc-400 leading-relaxed">{topic.description}</p>
            </div>

            {/* Key points */}
            <section>
              <div className="mb-4 flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-400" />
                <h2 className="text-xl font-semibold text-white">Key Points</h2>
              </div>
              <div className="rounded-xl border border-yellow-400/20 bg-yellow-400/5 p-5">
                <ul className="space-y-2.5">
                  {topic.keyPoints.map((point) => (
                    <li key={point} className="flex items-start gap-2.5 text-sm text-zinc-300 leading-relaxed">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-400" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Architecture flow */}
            {topic.architecture.length > 0 && (
              <section>
                <div className="mb-4 flex items-center gap-2">
                  <Workflow className="h-5 w-5 text-cyan-400" />
                  <h2 className="text-xl font-semibold text-white">How It Works</h2>
                </div>
                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
                  <ArchFlow steps={topic.architecture} />
                </div>
              </section>
            )}

            {/* Deep dive sections */}
            {topic.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="mb-3 text-xl font-semibold text-white">{section.heading}</h2>
                <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
                  {section.body && (
                    <p className="text-sm text-zinc-300 leading-relaxed">{section.body}</p>
                  )}
                  {section.bullets && (
                    <ul className={`space-y-2.5 ${section.body ? 'mt-4' : ''}`}>
                      {section.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2.5 text-sm text-zinc-400 leading-relaxed">
                          <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" />
                          {b}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>
            ))}

            {/* Trade-offs */}
            {topic.tradeoffs && (
              <section>
                <h2 className="mb-4 text-xl font-semibold text-white">Trade-offs</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-xl border border-green-400/20 bg-green-400/5 p-5">
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-green-400">
                      <CheckCircle className="h-4 w-4" />
                      Pros
                    </h3>
                    <ul className="space-y-2">
                      {topic.tradeoffs.pros.map((pro) => (
                        <li key={pro} className="flex items-start gap-2 text-sm text-zinc-300">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-green-400" />
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-xl border border-red-400/20 bg-red-400/5 p-5">
                    <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-red-400">
                      <XCircle className="h-4 w-4" />
                      Cons
                    </h3>
                    <ul className="space-y-2">
                      {topic.tradeoffs.cons.map((con) => (
                        <li key={con} className="flex items-start gap-2 text-sm text-zinc-300">
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-red-400" />
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            )}

            {/* Pitfalls */}
            <section>
              <div className="mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-400" />
                <h2 className="text-xl font-semibold text-white">Common Pitfalls</h2>
              </div>
              <div className="rounded-xl border border-amber-400/20 bg-amber-400/5 p-5">
                <ul className="space-y-2.5">
                  {topic.pitfalls.map((p) => (
                    <li key={p} className="flex items-start gap-2.5 text-sm text-zinc-300 leading-relaxed">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Interview tips */}
            <section>
              <div className="mb-4 flex items-center gap-2">
                <MessageSquareWarning className="h-5 w-5 text-purple-400" />
                <h2 className="text-xl font-semibold text-white">Interview Tips</h2>
              </div>
              <div className="rounded-xl border border-purple-400/20 bg-purple-400/5 p-5">
                <ul className="space-y-2.5">
                  {topic.interviewTips.map((tip) => (
                    <li key={tip} className="flex items-start gap-2.5 text-sm text-zinc-300 leading-relaxed">
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-purple-400" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Progress + Bookmark */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 space-y-3">
              <h3 className="text-sm font-medium text-zinc-300">Track This Topic</h3>
              <div className="flex flex-col gap-2">
                <ProgressTracker problemId={topic.id} problemTitle={topic.title} />
                <BookmarkButton
                  item={{
                    type: 'system-design',
                    id: topic.id,
                    slug: topic.slug,
                    title: topic.title,
                    subtitle: topic.category,
                  }}
                />
              </div>
            </div>

            {/* Related topics */}
            {related.length > 0 && (
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <Network className="h-4 w-4 text-cyan-400" />
                  <h3 className="text-sm font-medium text-zinc-300">Related Topics</h3>
                </div>
                <div className="space-y-1.5">
                  {related.map((r) => (
                    <Link
                      key={r.id}
                      href={`/system-design/${r.slug}`}
                      className="flex items-center justify-between rounded-lg px-2.5 py-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
                    >
                      <span className="truncate">{r.title}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
              <h3 className="mb-3 text-sm font-semibold text-zinc-200">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {topic.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-zinc-800 px-2.5 py-1 text-xs text-zinc-400">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Prev / next within same type */}
            {(prevTopic || nextTopic) && (
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                <h3 className="mb-3 text-sm font-medium text-zinc-300">
                  More {topic.type === 'fundamental' ? 'Fundamentals' : 'Case Studies'}
                </h3>
                <div className="space-y-2">
                  {prevTopic && (
                    <Link
                      href={`/system-design/${prevTopic.slug}`}
                      className="flex items-center gap-2 rounded-lg p-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
                    >
                      <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">{prevTopic.title}</span>
                    </Link>
                  )}
                  {nextTopic && (
                    <Link
                      href={`/system-design/${nextTopic.slug}`}
                      className="flex items-center justify-between gap-2 rounded-lg p-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
                    >
                      <span className="truncate">{nextTopic.title}</span>
                      <ArrowLeft className="h-3.5 w-3.5 shrink-0 rotate-180" />
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* All topics link */}
            <Link
              href="/system-design"
              className="block rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-center text-sm text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 transition-colors"
            >
              View all {systemDesignTopics.length} System Design Topics
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
