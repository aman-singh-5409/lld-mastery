import { patterns } from '@/data/patterns';
import PatternCard from '@/components/PatternCard';
import { Layers } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Design Patterns',
  description: 'Master all 22 Gang of Four design patterns with explanations, use cases, and Python code examples.',
};

const categories = ['Creational', 'Structural', 'Behavioral'] as const;

const categoryDescriptions = {
  Creational: 'Deal with object creation mechanisms, aiming to create objects in a manner suitable to the situation.',
  Structural: 'Deal with object composition, creating relationships between objects to form larger structures.',
  Behavioral: 'Deal with communication between objects, distributing responsibility between objects.',
};

const categoryColors = {
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

export default function PatternsPage() {
  const countByCategory = {
    Creational: patterns.filter((p) => p.category === 'Creational').length,
    Structural: patterns.filter((p) => p.category === 'Structural').length,
    Behavioral: patterns.filter((p) => p.category === 'Behavioral').length,
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10">
            <Layers className="h-5 w-5 text-purple-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">Design Patterns</h1>
            <p className="text-zinc-400">
              {patterns.length} Gang of Four patterns with code examples
            </p>
          </div>
        </div>

        {/* Category stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          {categories.map((cat) => {
            const config = categoryColors[cat];
            return (
              <div
                key={cat}
                className={`rounded-xl border p-4 ${config.bg} ${config.border}`}
              >
                <div className={`text-2xl font-bold ${config.text}`}>{countByCategory[cat]}</div>
                <div className="mt-0.5 text-sm font-medium text-white">{cat} Patterns</div>
                <p className="mt-1 text-xs text-zinc-400 line-clamp-2">
                  {categoryDescriptions[cat]}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pattern Groups */}
      {categories.map((category) => {
        const categoryPatterns = patterns.filter((p) => p.category === category);
        const config = categoryColors[category];

        return (
          <section key={category} className="mb-12">
            <div className="mb-5 flex items-center gap-3">
              <span className={`h-2 w-2 rounded-full ${config.bg.replace('/10', '')}`} />
              <h2 className={`text-xl font-bold ${config.text}`}>{category} Patterns</h2>
              <span className="text-sm text-zinc-500">({categoryPatterns.length})</span>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {categoryPatterns.map((pattern) => (
                <PatternCard key={pattern.id} pattern={pattern} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
