'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { problems } from '@/data/problems';
import ProblemCard from '@/components/ProblemCard';
import { ProgressStats } from '@/components/ProgressTracker';
import { useProgress } from '@/components/ProgressTracker';
import { Search, Filter, X } from 'lucide-react';
import { Suspense } from 'react';

type Difficulty = 'All' | 'Easy' | 'Medium' | 'Hard';

const difficulties: Difficulty[] = ['All', 'Easy', 'Medium', 'Hard'];

const categoryList = ['All', ...Array.from(new Set(problems.map((p) => p.category))).sort()];

function ProblemsContent() {
  const searchParams = useSearchParams();
  const [difficulty, setDifficulty] = useState<Difficulty>('All');
  const [category, setCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') ?? '');
  const { isCompleted } = useProgress();

  useEffect(() => {
    const q = searchParams.get('search');
    if (q) setSearchQuery(q);
  }, [searchParams]);

  const filtered = useMemo(() => {
    return problems.filter((problem) => {
      const matchesDifficulty = difficulty === 'All' || problem.difficulty === difficulty;
      const matchesCategory = category === 'All' || problem.category === category;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        problem.title.toLowerCase().includes(q) ||
        problem.description.toLowerCase().includes(q) ||
        problem.patterns.some((p) => p.toLowerCase().includes(q)) ||
        problem.tags.some((t) => t.toLowerCase().includes(q)) ||
        problem.category.toLowerCase().includes(q);
      return matchesDifficulty && matchesCategory && matchesSearch;
    });
  }, [difficulty, category, searchQuery]);

  const completedCount = problems.filter((p) => isCompleted(p.id)).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">LLD Problems</h1>
        <p className="mt-2 text-zinc-400">
          {problems.length} problems covering system design, data structures, games, and more.
        </p>
      </div>

      <div className="mb-8 grid gap-4 lg:grid-cols-4">
        {/* Filters Column */}
        <div className="lg:col-span-1 space-y-4">
          {/* Progress */}
          <ProgressStats total={problems.length} />

          {/* Search */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="mb-3 text-sm font-medium text-zinc-300 flex items-center gap-2">
              <Search className="h-4 w-4" /> Search
            </h3>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search problems..."
                className="w-full rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-300 placeholder-zinc-500 focus:border-blue-500 focus:outline-none"
                aria-label="Search problems"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="mb-3 text-sm font-medium text-zinc-300 flex items-center gap-2">
              <Filter className="h-4 w-4" /> Difficulty
            </h3>
            <div className="flex flex-col gap-2">
              {difficulties.map((d) => {
                const count = d === 'All' ? problems.length : problems.filter((p) => p.difficulty === d).length;
                const colors = {
                  All: 'text-zinc-300',
                  Easy: 'text-green-400',
                  Medium: 'text-yellow-400',
                  Hard: 'text-red-400',
                };
                return (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors ${
                      difficulty === d
                        ? 'bg-zinc-700 text-white'
                        : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                    }`}
                  >
                    <span className={difficulty === d ? 'text-white' : colors[d]}>{d}</span>
                    <span className="text-xs text-zinc-500">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Category Filter */}
          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <h3 className="mb-3 text-sm font-medium text-zinc-300">Category</h3>
            <div className="flex flex-col gap-1 max-h-64 overflow-y-auto pr-1">
              {categoryList.map((cat) => {
                const count = cat === 'All' ? problems.length : problems.filter((p) => p.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-sm transition-colors text-left ${
                      category === cat
                        ? 'bg-zinc-700 text-white'
                        : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
                    }`}
                  >
                    <span className="truncate">{cat}</span>
                    <span className="ml-2 shrink-0 text-xs text-zinc-500">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Problems Grid */}
        <div className="lg:col-span-3">
          {/* Active Filters */}
          {(difficulty !== 'All' || category !== 'All' || searchQuery) && (
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <span className="text-sm text-zinc-400">Active filters:</span>
              {difficulty !== 'All' && (
                <button
                  onClick={() => setDifficulty('All')}
                  className="flex items-center gap-1 rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300 hover:bg-zinc-700"
                >
                  {difficulty} <X className="h-3 w-3" />
                </button>
              )}
              {category !== 'All' && (
                <button
                  onClick={() => setCategory('All')}
                  className="flex items-center gap-1 rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300 hover:bg-zinc-700"
                >
                  {category} <X className="h-3 w-3" />
                </button>
              )}
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="flex items-center gap-1 rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-300 hover:bg-zinc-700"
                >
                  &quot;{searchQuery}&quot; <X className="h-3 w-3" />
                </button>
              )}
              <button
                onClick={() => { setDifficulty('All'); setCategory('All'); setSearchQuery(''); }}
                className="text-xs text-blue-400 hover:text-blue-300"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Results Count */}
          <div className="mb-4 text-sm text-zinc-400">
            Showing <span className="font-medium text-white">{filtered.length}</span> of{' '}
            <span className="font-medium text-white">{problems.length}</span> problems
            {completedCount > 0 && (
              <span className="ml-2 text-green-400">• {completedCount} completed</span>
            )}
          </div>

          {/* Grid */}
          {filtered.length > 0 ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {filtered.map((problem) => (
                <ProblemCard
                  key={problem.id}
                  problem={problem}
                  completed={isCompleted(problem.id)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 py-16 text-center">
              <Search className="mb-4 h-10 w-10 text-zinc-600" />
              <h3 className="mb-2 text-lg font-medium text-zinc-300">No problems found</h3>
              <p className="text-sm text-zinc-500">
                Try adjusting your filters or search query
              </p>
              <button
                onClick={() => { setDifficulty('All'); setCategory('All'); setSearchQuery(''); }}
                className="mt-4 rounded-lg bg-zinc-800 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProblemsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-64">
        <div className="text-zinc-400">Loading problems...</div>
      </div>
    }>
      <ProblemsContent />
    </Suspense>
  );
}
