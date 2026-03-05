'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X, Code2, Layers, BookOpen, ArrowRight } from 'lucide-react';
import { problems } from '@/data/problems';
import { patterns } from '@/data/patterns';
import { oopConcepts } from '@/data/oop';

type ResultType = 'problem' | 'pattern' | 'oop';

interface SearchResult {
  type: ResultType;
  id: string;
  title: string;
  subtitle: string;
  href: string;
  badge?: string;
  badgeColor?: string;
}

const MAX_PER_SECTION = 5;

function search(query: string): SearchResult[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  const results: SearchResult[] = [];

  // Search problems
  const matchedProblems = problems.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      p.patterns.some((pt) => pt.toLowerCase().includes(q))
  );
  matchedProblems.slice(0, MAX_PER_SECTION).forEach((p) => {
    const badgeColor =
      p.difficulty === 'Easy'
        ? 'text-green-400 bg-green-400/10'
        : p.difficulty === 'Medium'
        ? 'text-yellow-400 bg-yellow-400/10'
        : 'text-red-400 bg-red-400/10';
    results.push({
      type: 'problem',
      id: p.id,
      title: p.title,
      subtitle: p.category,
      href: `/problems/${p.slug}`,
      badge: p.difficulty,
      badgeColor,
    });
  });

  // Search patterns
  const matchedPatterns = patterns.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.intent.toLowerCase().includes(q) ||
      p.useCases.some((u) => u.toLowerCase().includes(q))
  );
  matchedPatterns.slice(0, MAX_PER_SECTION).forEach((p) => {
    const badgeColor =
      p.category === 'Creational'
        ? 'text-emerald-400 bg-emerald-400/10'
        : p.category === 'Structural'
        ? 'text-blue-400 bg-blue-400/10'
        : 'text-purple-400 bg-purple-400/10';
    results.push({
      type: 'pattern',
      id: p.id,
      title: p.name,
      subtitle: p.description.slice(0, 70) + (p.description.length > 70 ? '…' : ''),
      href: `/patterns/${p.slug}`,
      badge: p.category,
      badgeColor,
    });
  });

  // Search OOP concepts
  const matchedOop = oopConcepts.filter(
    (c) =>
      c.title.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      c.keyPoints.some((kp) => kp.toLowerCase().includes(q))
  );
  matchedOop.slice(0, MAX_PER_SECTION).forEach((c) => {
    results.push({
      type: 'oop',
      id: c.id,
      title: c.title,
      subtitle: c.description.slice(0, 70) + (c.description.length > 70 ? '…' : ''),
      href: `/oop/${c.slug}`,
      badge: c.category,
      badgeColor: 'text-orange-400 bg-orange-400/10',
    });
  });

  return results;
}

const typeConfig: Record<ResultType, { icon: React.ElementType; color: string; label: string }> = {
  problem: { icon: Code2, color: 'text-blue-400', label: 'Problems' },
  pattern: { icon: Layers, color: 'text-purple-400', label: 'Patterns' },
  oop: { icon: BookOpen, color: 'text-orange-400', label: 'OOP Concepts' },
};

interface SearchModalProps {
  open: boolean;
  onClose: () => void;
}

export default function SearchModal({ open, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const results = search(query);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [open]);

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const navigate = useCallback(
    (href: string) => {
      router.push(href);
      onClose();
    },
    [router, onClose]
  );

  // Keyboard navigation
  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, results.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter' && results[selectedIndex]) {
        navigate(results[selectedIndex].href);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open, results, selectedIndex, onClose, navigate]);

  if (!open) return null;

  // Group results by type
  const grouped: Partial<Record<ResultType, SearchResult[]>> = {};
  results.forEach((r) => {
    if (!grouped[r.type]) grouped[r.type] = [];
    grouped[r.type]!.push(r);
  });

  // Flat index lookup
  const allResults = results;

  const typeOrder: ResultType[] = ['problem', 'pattern', 'oop'];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[10vh] px-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative z-10 w-full max-w-2xl rounded-2xl border border-zinc-700 bg-zinc-900 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 border-b border-zinc-800 px-4 py-3.5">
          <Search className="h-5 w-5 shrink-0 text-zinc-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search problems, patterns, OOP concepts..."
            className="flex-1 bg-transparent text-base text-white placeholder-zinc-500 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-zinc-500 hover:text-zinc-300">
              <X className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex h-6 items-center rounded border border-zinc-700 px-1.5 text-xs text-zinc-500">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[60vh] overflow-y-auto">
          {query === '' && (
            <div className="px-4 py-8 text-center text-sm text-zinc-500">
              <Search className="mx-auto mb-2 h-8 w-8 opacity-30" />
              Type to search across all content
            </div>
          )}

          {query !== '' && results.length === 0 && (
            <div className="px-4 py-8 text-center text-sm text-zinc-500">
              No results found for &ldquo;{query}&rdquo;
            </div>
          )}

          {query !== '' &&
            results.length > 0 &&
            typeOrder.map((type) => {
              const group = grouped[type];
              if (!group?.length) return null;
              const { icon: Icon, color, label } = typeConfig[type];

              return (
                <div key={type}>
                  {/* Section Header */}
                  <div className="flex items-center gap-2 border-b border-zinc-800/50 px-4 py-2">
                    <Icon className={`h-3.5 w-3.5 ${color}`} />
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      {label}
                    </span>
                  </div>

                  {/* Results */}
                  {group.map((result) => {
                    const flatIdx = allResults.indexOf(result);
                    const isSelected = flatIdx === selectedIndex;
                    const { icon: ResIcon, color: resColor } = typeConfig[result.type];

                    return (
                      <button
                        key={result.id}
                        onClick={() => navigate(result.href)}
                        onMouseEnter={() => setSelectedIndex(flatIdx)}
                        className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                          isSelected ? 'bg-zinc-800' : 'hover:bg-zinc-800/50'
                        }`}
                      >
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-800 ${isSelected ? 'bg-zinc-700' : ''}`}>
                          <ResIcon className={`h-4 w-4 ${resColor}`} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="truncate text-sm font-medium text-white">
                              {result.title}
                            </span>
                            {result.badge && (
                              <span className={`shrink-0 rounded px-1.5 py-0.5 text-xs font-medium ${result.badgeColor}`}>
                                {result.badge}
                              </span>
                            )}
                          </div>
                          <p className="truncate text-xs text-zinc-500">{result.subtitle}</p>
                        </div>
                        {isSelected && <ArrowRight className="h-3.5 w-3.5 shrink-0 text-zinc-500" />}
                      </button>
                    );
                  })}
                </div>
              );
            })}
        </div>

        {/* Footer */}
        <div className="flex items-center gap-4 border-t border-zinc-800 px-4 py-2.5 text-xs text-zinc-600">
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-zinc-700 px-1 text-zinc-500">↑↓</kbd> navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-zinc-700 px-1 text-zinc-500">↵</kbd> select
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-zinc-700 px-1 text-zinc-500">ESC</kbd> close
          </span>
        </div>
      </div>
    </div>
  );
}
