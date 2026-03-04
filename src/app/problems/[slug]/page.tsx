import { notFound } from 'next/navigation';
import Link from 'next/link';
import { problems, getProblemBySlug } from '@/data/problems';
import CodeBlock from '@/components/CodeBlock';
import DiagramViewer from '@/components/DiagramViewer';
import ProgressTracker from '@/components/ProgressTracker';
import { ArrowLeft, BookOpen, Code2, GitBranch, Layers, Tag, CheckCircle2 } from 'lucide-react';
import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site-config';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return problems.map((problem) => ({
    slug: problem.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const problem = getProblemBySlug(slug);
  if (!problem) return { title: 'Problem Not Found' };

  const title = `${problem.title} — Low Level Design`;
  const description = `${problem.description} | ${problem.difficulty} difficulty. Step-by-step solution with UML class diagram and code in Python, Java, C++, and TypeScript.`;
  const ogImageUrl = `/api/og?title=${encodeURIComponent(problem.title)}&subtitle=${encodeURIComponent(problem.description)}&type=problem`;

  return {
    title,
    description,
    keywords: [
      problem.title,
      'Low Level Design',
      'LLD Interview',
      problem.category,
      ...problem.patterns,
      ...problem.tags,
      'System Design',
      'OOP Design',
    ],
    alternates: { canonical: `${siteConfig.url}/problems/${slug}` },
    openGraph: {
      title,
      description,
      url: `${siteConfig.url}/problems/${slug}`,
      siteName: siteConfig.name,
      type: 'article',
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: problem.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

const difficultyConfig = {
  Easy: { color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/30' },
  Medium: { color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/30' },
  Hard: { color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/30' },
};

export default async function ProblemDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const problem = getProblemBySlug(slug);

  if (!problem) {
    notFound();
  }

  const diff = difficultyConfig[problem.difficulty];

  // Get adjacent problems for navigation
  const currentIndex = problems.findIndex((p) => p.slug === slug);
  const prevProblem = currentIndex > 0 ? problems[currentIndex - 1] : null;
  const nextProblem = currentIndex < problems.length - 1 ? problems[currentIndex + 1] : null;

  const codeTabs = problem.code
    ? [
        { language: 'python', label: 'Python', code: problem.code.python },
        { language: 'java', label: 'Java', code: problem.code.java },
        { language: 'cpp', label: 'C++', code: problem.code.cpp },
        { language: 'typescript', label: 'TypeScript', code: problem.code.typescript },
      ]
    : [];

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${siteConfig.url}/problems/${slug}`,
        headline: problem.title,
        description: problem.description,
        author: { '@type': 'Organization', name: siteConfig.name },
        publisher: { '@type': 'Organization', name: siteConfig.name },
        url: `${siteConfig.url}/problems/${slug}`,
        keywords: problem.tags.join(', '),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
          { '@type': 'ListItem', position: 2, name: 'Problems', item: `${siteConfig.url}/problems` },
          { '@type': 'ListItem', position: 3, name: problem.title, item: `${siteConfig.url}/problems/${slug}` },
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
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/problems"
          className="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Problems
        </Link>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${diff.bg} ${diff.border} ${diff.color}`}>
                {problem.difficulty}
              </span>
              <span className="text-sm text-zinc-500">{problem.category}</span>
            </div>
            <h1 className="mb-4 text-3xl font-bold text-white">{problem.title}</h1>
            <p className="text-zinc-400 leading-relaxed">{problem.description}</p>
          </div>

          {/* Requirements */}
          <section>
            <div className="mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-blue-400" />
              <h2 className="text-xl font-semibold text-white">Requirements</h2>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
              <ol className="space-y-3">
                {problem.requirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-zinc-300">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-500/20 text-xs font-medium text-blue-400 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{req}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* Class Diagram */}
          {problem.diagramFile && (
            <section>
              <div className="mb-4 flex items-center gap-2">
                <GitBranch className="h-5 w-5 text-purple-400" />
                <h2 className="text-xl font-semibold text-white">UML Class Diagram</h2>
              </div>
              <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 p-4">
                <DiagramViewer
                  src={`/diagrams/${problem.diagramFile}`}
                  alt={`${problem.title} class diagram`}
                  caption={`UML Class Diagram for ${problem.title}`}
                />
              </div>
            </section>
          )}

          {/* Classes & Interfaces */}
          <section>
            <div className="mb-4 flex items-center gap-2">
              <Code2 className="h-5 w-5 text-emerald-400" />
              <h2 className="text-xl font-semibold text-white">Classes & Interfaces</h2>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
              <div className="grid gap-2 sm:grid-cols-2">
                {problem.classes.map((cls) => (
                  <div
                    key={cls}
                    className="flex items-center gap-2 rounded-lg bg-zinc-800/50 px-3 py-2"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" />
                    <code className="text-sm text-zinc-200 font-mono">{cls}</code>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Code Implementation */}
          {codeTabs.length > 0 && (
            <section>
              <div className="mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-orange-400" />
                <h2 className="text-xl font-semibold text-white">Code Implementation</h2>
              </div>
              <CodeBlock tabs={codeTabs} title={problem.title} />
            </section>
          )}

          {/* Note about solutions */}
          {codeTabs.length === 0 && (
            <section>
              <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
                <div className="mb-3 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-orange-400" />
                  <h2 className="text-lg font-semibold text-white">Code Implementation</h2>
                </div>
                <p className="mb-4 text-sm text-zinc-400">
                  Solutions for this problem are available in multiple languages in the{' '}
                  <a
                    href="https://github.com/ashishps1/awesome-low-level-design"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    awesome-low-level-design
                  </a>{' '}
                  repository.
                </p>
                <div className="flex flex-wrap gap-2">
                  {problem.languages.map((lang) => (
                    <span
                      key={lang}
                      className="rounded-lg bg-zinc-800 px-3 py-1.5 text-sm text-zinc-300"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Progress Tracker */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="mb-3 text-sm font-medium text-zinc-300">Track Progress</h3>
            <ProgressTracker problemId={problem.id} problemTitle={problem.title} />
          </div>

          {/* Design Patterns */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <div className="mb-3 flex items-center gap-2">
              <Layers className="h-4 w-4 text-purple-400" />
              <h3 className="text-sm font-medium text-zinc-300">Design Patterns Used</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {problem.patterns.map((pattern) => (
                <span
                  key={pattern}
                  className="rounded-full bg-purple-500/10 border border-purple-500/20 px-3 py-1 text-xs text-purple-400"
                >
                  {pattern}
                </span>
              ))}
            </div>
          </div>

          {/* Tags */}
          {problem.tags.length > 0 && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <div className="mb-3 flex items-center gap-2">
                <Tag className="h-4 w-4 text-zinc-400" />
                <h3 className="text-sm font-medium text-zinc-300">Tags</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {problem.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-zinc-800 px-2.5 py-1 text-xs text-zinc-400"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="mb-3 text-sm font-medium text-zinc-300">Available Languages</h3>
            <div className="grid grid-cols-2 gap-2">
              {problem.languages.map((lang) => (
                <div
                  key={lang}
                  className="flex items-center gap-1.5 rounded-lg bg-zinc-800 px-2.5 py-1.5"
                >
                  <div className="h-1.5 w-1.5 rounded-full bg-blue-400" />
                  <span className="text-xs text-zinc-300">{lang}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Difficulty context */}
          <div className={`rounded-xl border p-4 ${diff.border} ${diff.bg}`}>
            <h3 className={`mb-2 text-sm font-medium ${diff.color}`}>
              Difficulty: {problem.difficulty}
            </h3>
            <p className="text-xs text-zinc-400">
              {problem.difficulty === 'Easy' &&
                'Good starting point. Focus on understanding basic OOP concepts and applying one or two design patterns.'}
              {problem.difficulty === 'Medium' &&
                'Requires solid OOP knowledge and understanding of multiple design patterns with concurrent access handling.'}
              {problem.difficulty === 'Hard' &&
                'Complex system with multiple interacting components. Requires deep understanding of design patterns, concurrency, and system design.'}
            </p>
          </div>

          {/* Navigation */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="mb-3 text-sm font-medium text-zinc-300">More Problems</h3>
            <div className="space-y-2">
              {prevProblem && (
                <Link
                  href={`/problems/${prevProblem.slug}`}
                  className="flex items-center gap-2 rounded-lg p-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{prevProblem.title}</span>
                </Link>
              )}
              {nextProblem && (
                <Link
                  href={`/problems/${nextProblem.slug}`}
                  className="flex items-center justify-between gap-2 rounded-lg p-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
                >
                  <span className="truncate">{nextProblem.title}</span>
                  <ArrowLeft className="h-3.5 w-3.5 shrink-0 rotate-180" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
