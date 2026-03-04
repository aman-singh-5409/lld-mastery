import { notFound } from 'next/navigation';
import Link from 'next/link';
import { patterns, getPatternBySlug } from '@/data/patterns';
import CodeBlock from '@/components/CodeBlock';
import { ArrowLeft, CheckCircle, XCircle, Lightbulb, Code2 } from 'lucide-react';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ pattern: string }>;
}

export async function generateStaticParams() {
  return patterns.map((p) => ({ pattern: p.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { pattern: slug } = await params;
  const pattern = getPatternBySlug(slug);
  if (!pattern) return { title: 'Pattern Not Found' };
  return {
    title: `${pattern.name} Pattern`,
    description: pattern.description,
  };
}

const categoryConfig = {
  Creational: {
    text: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20',
  },
  Structural: {
    text: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/20',
  },
  Behavioral: {
    text: 'text-purple-400',
    bg: 'bg-purple-400/10',
    border: 'border-purple-400/20',
  },
};

export default async function PatternDetailPage({ params }: PageProps) {
  const { pattern: slug } = await params;
  const pattern = getPatternBySlug(slug);

  if (!pattern) {
    notFound();
  }

  const config = categoryConfig[pattern.category];

  // Get adjacent patterns
  const categoryPatterns = patterns.filter((p) => p.category === pattern.category);
  const currentIndex = categoryPatterns.findIndex((p) => p.slug === slug);
  const prevPattern = currentIndex > 0 ? categoryPatterns[currentIndex - 1] : null;
  const nextPattern = currentIndex < categoryPatterns.length - 1 ? categoryPatterns[currentIndex + 1] : null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <div className="mb-6 flex items-center gap-2 text-sm text-zinc-500">
        <Link href="/patterns" className="flex items-center gap-1.5 hover:text-zinc-200 transition-colors">
          <ArrowLeft className="h-4 w-4" />
          All Patterns
        </Link>
        <span>/</span>
        <span className={config.text}>{pattern.category}</span>
        <span>/</span>
        <span className="text-zinc-300">{pattern.name}</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Header */}
          <div>
            <div className="mb-3">
              <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${config.bg} ${config.border} ${config.text}`}>
                {pattern.category} Pattern
              </span>
            </div>
            <h1 className="mb-3 text-3xl font-bold text-white">{pattern.name}</h1>
            <p className="text-zinc-400 leading-relaxed">{pattern.description}</p>
          </div>

          {/* Intent */}
          <section>
            <div className="mb-4 flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-400" />
              <h2 className="text-xl font-semibold text-white">Intent</h2>
            </div>
            <div className="rounded-xl border border-yellow-400/20 bg-yellow-400/5 p-5">
              <p className="text-zinc-300 leading-relaxed italic">{pattern.intent}</p>
            </div>
          </section>

          {/* Code Example */}
          <section>
            <div className="mb-4 flex items-center gap-2">
              <Code2 className="h-5 w-5 text-blue-400" />
              <h2 className="text-xl font-semibold text-white">Implementation</h2>
            </div>
            <CodeBlock
              tabs={[
                { language: 'python', label: 'Python', code: pattern.code.python },
                { language: 'java', label: 'Java', code: pattern.code.java },
                { language: 'cpp', label: 'C++', code: pattern.code.cpp },
                { language: 'typescript', label: 'TypeScript', code: pattern.code.typescript },
              ]}
              title={`${pattern.name} Pattern`}
            />
          </section>

          {/* Pros and Cons */}
          <section>
            <h2 className="mb-4 text-xl font-semibold text-white">Pros & Cons</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-xl border border-green-400/20 bg-green-400/5 p-5">
                <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-green-400">
                  <CheckCircle className="h-4 w-4" />
                  Advantages
                </h3>
                <ul className="space-y-2">
                  {pattern.pros.map((pro) => (
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
                  Disadvantages
                </h3>
                <ul className="space-y-2">
                  {pattern.cons.map((con) => (
                    <li key={con} className="flex items-start gap-2 text-sm text-zinc-300">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-red-400" />
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Use Cases */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5">
            <h3 className="mb-4 text-sm font-semibold text-zinc-200">Real-World Use Cases</h3>
            <ul className="space-y-2.5">
              {pattern.useCases.map((useCase) => (
                <li key={useCase} className="flex items-start gap-2.5 text-sm text-zinc-400">
                  <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                  {useCase}
                </li>
              ))}
            </ul>
          </div>

          {/* Pattern Category Info */}
          <div className={`rounded-xl border p-4 ${config.border} ${config.bg}`}>
            <div className={`mb-1 text-xs font-semibold uppercase tracking-wider ${config.text}`}>
              Category
            </div>
            <div className="text-lg font-bold text-white">{pattern.category}</div>
            <p className="mt-1 text-xs text-zinc-400">
              {pattern.category === 'Creational' &&
                'Focuses on object creation, providing flexible object creation mechanisms.'}
              {pattern.category === 'Structural' &&
                'Deals with assembling objects and classes into larger structures.'}
              {pattern.category === 'Behavioral' &&
                'Focuses on algorithms and communication between objects.'}
            </p>
          </div>

          {/* Other patterns in category */}
          {(prevPattern || nextPattern) && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <h3 className="mb-3 text-sm font-medium text-zinc-300">
                More {pattern.category} Patterns
              </h3>
              <div className="space-y-2">
                {prevPattern && (
                  <Link
                    href={`/patterns/${prevPattern.slug}`}
                    className="flex items-center gap-2 rounded-lg p-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
                  >
                    <ArrowLeft className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{prevPattern.name}</span>
                  </Link>
                )}
                {nextPattern && (
                  <Link
                    href={`/patterns/${nextPattern.slug}`}
                    className="flex items-center justify-between gap-2 rounded-lg p-2 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
                  >
                    <span className="truncate">{nextPattern.name}</span>
                    <ArrowLeft className="h-3.5 w-3.5 shrink-0 rotate-180" />
                  </Link>
                )}
              </div>
            </div>
          )}

          {/* All patterns link */}
          <Link
            href="/patterns"
            className="block rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-center text-sm text-zinc-400 hover:border-zinc-700 hover:text-zinc-200 transition-colors"
          >
            View all {patterns.length} Design Patterns
          </Link>
        </div>
      </div>
    </div>
  );
}
