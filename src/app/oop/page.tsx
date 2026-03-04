import Link from 'next/link';
import { oopConcepts } from '@/data/oop';
import { ArrowRight, BookOpen, Code2 } from 'lucide-react';
import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site-config';

const title = 'OOP Fundamentals — Object-Oriented Programming Concepts';
const description =
  'Master Object-Oriented Programming with Encapsulation, Inheritance, Polymorphism, Abstraction, SOLID principles, and more. Interactive code examples in Python, Java, C++, and TypeScript.';

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    'Object Oriented Programming',
    'OOP Concepts',
    'Encapsulation',
    'Inheritance',
    'Polymorphism',
    'Abstraction',
    'SOLID Principles',
    'Design Principles',
    'Composition vs Inheritance',
    'Coupling and Cohesion',
  ],
  alternates: { canonical: `${siteConfig.url}/oop` },
  openGraph: {
    title,
    description,
    url: `${siteConfig.url}/oop`,
    siteName: siteConfig.name,
    images: [
      {
        url: `/api/og?title=${encodeURIComponent('OOP Fundamentals')}&subtitle=${encodeURIComponent(description)}&type=concept`,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [
      `/api/og?title=${encodeURIComponent('OOP Fundamentals')}&subtitle=${encodeURIComponent(description)}&type=concept`,
    ],
  },
};

const categoryColors: Record<string, { text: string; bg: string; border: string }> = {
  'Core Pillar': { text: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
  'Design Principles': { text: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
  'Patterns Foundation': { text: 'text-orange-400', bg: 'bg-orange-400/10', border: 'border-orange-400/20' },
};

const groups = [
  {
    category: 'Core Pillar',
    title: 'Four Pillars of OOP',
    description: 'The foundational principles of Object-Oriented Programming',
  },
  {
    category: 'Design Principles',
    title: 'Design Principles',
    description: 'Guidelines for writing clean, maintainable, and extensible code',
  },
  {
    category: 'Patterns Foundation',
    title: 'Patterns Foundation',
    description: 'Core concepts needed to understand and apply design patterns',
  },
];

export default function OOPPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10">
            <BookOpen className="h-5 w-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">OOP Fundamentals</h1>
            <p className="text-zinc-400">
              Build the foundation needed to master Low Level Design
            </p>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          {groups.map(({ category, title, description }) => {
            const concepts = oopConcepts.filter((c) => c.category === category);
            const config = categoryColors[category];
            return (
              <div
                key={category}
                className={`rounded-xl border p-4 ${config.bg} ${config.border}`}
              >
                <div className={`text-2xl font-bold ${config.text}`}>{concepts.length}</div>
                <div className="mt-0.5 text-sm font-medium text-white">{title}</div>
                <p className="mt-1 text-xs text-zinc-400">{description}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Learning Path */}
      <div className="mb-10 rounded-xl border border-zinc-800 bg-gradient-to-r from-blue-900/20 to-emerald-900/20 p-6">
        <h2 className="mb-3 text-lg font-semibold text-white">Recommended Learning Path</h2>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {[
            { step: '1', label: 'Encapsulation', slug: 'encapsulation' },
            { step: '2', label: 'Inheritance', slug: 'inheritance' },
            { step: '3', label: 'Polymorphism', slug: 'polymorphism' },
            { step: '4', label: 'Abstraction', slug: 'abstraction' },
            { step: '5', label: 'SOLID', slug: 'solid-principles' },
          ].map(({ step, label, slug }, idx) => (
            <div key={slug} className="flex items-center gap-2">
              {idx > 0 && <ArrowRight className="hidden h-4 w-4 text-zinc-600 sm:block" />}
              <Link
                href={`/oop/${slug}`}
                className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-300 hover:border-zinc-600 hover:text-white transition-colors"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                  {step}
                </span>
                {label}
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Concept Groups */}
      {groups.map(({ category, title, description }) => {
        const concepts = oopConcepts.filter((c) => c.category === category);
        const config = categoryColors[category];

        return (
          <section key={category} className="mb-10">
            <div className="mb-5">
              <h2 className={`text-xl font-bold ${config.text}`}>{title}</h2>
              <p className="text-sm text-zinc-400">{description}</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {concepts.map((concept) => (
                <Link
                  key={concept.id}
                  href={`/oop/${concept.slug}`}
                  className="group rounded-xl border border-zinc-800 bg-zinc-900 p-5 transition-all hover:border-zinc-700 hover:bg-zinc-800/50"
                >
                  {/* Category badge */}
                  <div className="mb-3">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${config.bg} ${config.border} ${config.text}`}>
                      {concept.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="mb-2 text-base font-semibold text-white group-hover:text-blue-400 transition-colors">
                    {concept.title}
                  </h3>

                  {/* Description */}
                  <p className="mb-4 text-sm text-zinc-400 leading-relaxed line-clamp-3">
                    {concept.description}
                  </p>

                  {/* Key points preview */}
                  <div className="space-y-1.5">
                    {concept.keyPoints.slice(0, 2).map((point) => (
                      <div key={point} className="flex items-start gap-2 text-xs text-zinc-500">
                        <div className="mt-1 h-1 w-1 shrink-0 rounded-full bg-zinc-600" />
                        <span className="line-clamp-1">{point}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center gap-1.5 text-xs text-blue-400">
                    <Code2 className="h-3.5 w-3.5" />
                    View with code example
                    <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
