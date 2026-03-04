import { notFound } from 'next/navigation';
import Link from 'next/link';
import { oopConcepts, getConceptBySlug } from '@/data/oop';
import CodeBlock from '@/components/CodeBlock';
import { ArrowLeft, BookOpen, Code2, Lightbulb } from 'lucide-react';
import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site-config';

interface PageProps {
  params: Promise<{ concept: string }>;
}

export async function generateStaticParams() {
  return oopConcepts.map((c) => ({ concept: c.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { concept: slug } = await params;
  const concept = getConceptBySlug(slug);
  if (!concept) return { title: 'Concept Not Found' };

  const title = `${concept.title} — OOP Concept Explained`;
  const description = `${concept.description} Interactive code examples in Python, Java, C++, and TypeScript with real-world analogies.`;
  const ogImageUrl = `/api/og?title=${encodeURIComponent(concept.title)}&subtitle=${encodeURIComponent(concept.description)}&type=concept`;

  return {
    title,
    description,
    keywords: [
      concept.title,
      concept.category,
      'OOP Concepts',
      'Object Oriented Programming',
      'Software Design',
      ...concept.keyPoints.slice(0, 3),
    ],
    alternates: { canonical: `${siteConfig.url}/oop/${slug}` },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/oop/${slug}`,
      siteName: siteConfig.name,
      type: 'article',
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: concept.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

const categoryColors: Record<string, { text: string; bg: string; border: string }> = {
  'Core Pillar': { text: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
  'Design Principles': { text: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
  'Patterns Foundation': { text: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' },
};

export default async function OOPConceptPage({ params }: PageProps) {
  const { concept: slug } = await params;
  const concept = getConceptBySlug(slug);

  if (!concept) {
    notFound();
  }

  const config = categoryColors[concept.category] ?? categoryColors['Core Pillar'];

  // Get adjacent concepts in same category
  const categoryConceptsList = oopConcepts.filter((c) => c.category === concept.category);
  const currentIndex = categoryConceptsList.findIndex((c) => c.slug === slug);
  const prevConcept = currentIndex > 0 ? categoryConceptsList[currentIndex - 1] : null;
  const nextConcept =
    currentIndex < categoryConceptsList.length - 1
      ? categoryConceptsList[currentIndex + 1]
      : null;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${siteConfig.url}/oop/${slug}`,
        headline: concept.title,
        description: concept.description,
        author: { '@type': 'Organization', name: siteConfig.name },
        publisher: { '@type': 'Organization', name: siteConfig.name },
        url: `${siteConfig.url}/oop/${slug}`,
        about: { '@type': 'Thing', name: concept.category },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
          { '@type': 'ListItem', position: 2, name: 'OOP Concepts', item: `${siteConfig.url}/oop` },
          { '@type': 'ListItem', position: 3, name: concept.title, item: `${siteConfig.url}/oop/${slug}` },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
        <Link href="/oop" className="flex items-center gap-1.5 hover:text-zinc-200 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          OOP Concepts
        </Link>
        <span>/</span>
        <span className={config.text}>{concept.category}</span>
        <span>/</span>
        <span className="text-zinc-300">{concept.title}</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div>
            <div className="mb-3">
              <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${config.bg} ${config.border} ${config.text}`}>
                {concept.category}
              </span>
            </div>
            <h1 className="mb-4 text-3xl font-bold text-white">{concept.title}</h1>
            <p className="text-zinc-400 leading-relaxed">{concept.description}</p>
          </div>

          {/* Key Points */}
          <section>
            <div className="mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-emerald-400" />
              <h2 className="text-xl font-semibold text-white">Key Concepts</h2>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
              <ul className="space-y-3">
                {concept.keyPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-zinc-300">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-medium text-emerald-400 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* Real-World Example */}
          <section>
            <div className="mb-4 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-400" />
              <h2 className="text-xl font-semibold text-white">Real-World Analogy</h2>
            </div>
            <div className="rounded-xl border border-yellow-400/20 bg-yellow-400/5 p-5">
              <p className="text-zinc-300 leading-relaxed">{concept.realWorldExample}</p>
            </div>
          </section>

          {/* Code Example */}
          <section>
            <div className="mb-4 flex items-center gap-2">
              <Code2 className="h-5 w-5 text-blue-400" />
              <h2 className="text-xl font-semibold text-white">Code Example</h2>
            </div>
            <CodeBlock
              tabs={[
                { language: 'python', label: 'Python', code: concept.code.python },
                { language: 'java', label: 'Java', code: concept.code.java },
                { language: 'cpp', label: 'C++', code: concept.code.cpp },
                { language: 'typescript', label: 'TypeScript', code: concept.code.typescript },
              ]}
              title={concept.title}
            />
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Category info */}
          <div className={`rounded-xl border p-4 ${config.border} ${config.bg}`}>
            <div className={`mb-1 text-xs font-semibold uppercase tracking-wider ${config.text}`}>
              Category
            </div>
            <div className="text-lg font-bold text-white">{concept.category}</div>
          </div>

          {/* Quick Summary */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
            <h3 className="mb-4 text-sm font-semibold text-zinc-200">Quick Summary</h3>
            <ul className="space-y-2">
              {concept.keyPoints.slice(0, 4).map((point) => {
                // Extract the key term before the colon
                const parts = point.split(':');
                const term = parts.length > 1 ? parts[0] : null;
                const detail = parts.length > 1 ? parts.slice(1).join(':').trim() : point;
                return (
                  <li key={point} className="text-xs text-zinc-400">
                    {term ? (
                      <>
                        <span className="font-medium text-zinc-200">{term}:</span>{' '}
                        <span className="line-clamp-2">{detail}</span>
                      </>
                    ) : (
                      <span className="line-clamp-2">{point}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Related Concepts */}
          {(prevConcept || nextConcept) && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <h3 className="mb-3 text-sm font-medium text-zinc-300">Related Concepts</h3>
              <div className="space-y-2">
                {prevConcept && (
                  <Link
                    href={`/oop/${prevConcept.slug}`}
                    className="flex items-center gap-2 rounded-lg p-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
                  >
                    <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{prevConcept.title}</span>
                  </Link>
                )}
                {nextConcept && (
                  <Link
                    href={`/oop/${nextConcept.slug}`}
                    className="flex items-center justify-between gap-2 rounded-lg p-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
                  >
                    <span className="truncate">{nextConcept.title}</span>
                    <ArrowLeft className="h-3.5 w-3.5 shrink-0 rotate-180" />
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* All concepts */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="mb-3 text-sm font-medium text-zinc-300">All OOP Concepts</h3>
            <div className="space-y-1">
              {oopConcepts.map((c) => {
                const isActive = c.slug === slug;
                const cConfig = categoryColors[c.category];
                return (
                  <Link
                    key={c.slug}
                    href={`/oop/${c.slug}`}
                    className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm transition-colors ${
                      isActive
                        ? 'bg-zinc-700 text-white'
                        : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${isActive ? 'bg-blue-400' : `${cConfig?.bg ?? ''}`}`} />
                    <span className="truncate">{c.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Next steps */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="mb-3 text-sm font-medium text-zinc-300">Apply Your Knowledge</h3>
            <Link
              href="/patterns"
              className="flex items-center justify-between rounded-lg border border-zinc-700 p-3 text-sm text-zinc-300 hover:border-zinc-600 hover:bg-zinc-800 transition-colors"
            >
              <span>Explore Design Patterns</span>
              <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
            </Link>
            <Link
              href="/problems"
              className="mt-2 flex items-center justify-between rounded-lg border border-blue-500/30 bg-blue-500/10 p-3 text-sm text-blue-400 hover:bg-blue-500/20 transition-colors"
            >
              <span>Solve LLD Problems</span>
              <ArrowLeft className="h-3.5 w-3.5 rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
