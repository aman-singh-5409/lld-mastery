'use client';

import Link from 'next/link';
import { useBookmarks } from '@/components/BookmarkButton';
import { Bookmark, Code2, Layers, Trash2, ArrowRight } from 'lucide-react';

export default function BookmarksPage() {
  const { bookmarks, remove } = useBookmarks();

  const problems = bookmarks.filter((b) => b.type === 'problem');
  const patterns = bookmarks.filter((b) => b.type === 'pattern');

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <div className="mb-2 flex items-center gap-3">
          <Bookmark className="h-6 w-6 text-yellow-400" />
          <h1 className="text-3xl font-bold text-white">Saved Items</h1>
        </div>
        <p className="text-zinc-400">
          {bookmarks.length === 0
            ? 'No saved items yet.'
            : `${bookmarks.length} item${bookmarks.length !== 1 ? 's' : ''} saved`}
        </p>
      </div>

      {/* Empty state */}
      {bookmarks.length === 0 && (
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-12 text-center">
          <Bookmark className="mx-auto mb-4 h-12 w-12 text-zinc-700" />
          <h2 className="mb-2 text-lg font-semibold text-zinc-300">Nothing saved yet</h2>
          <p className="mb-6 text-sm text-zinc-500">
            Bookmark problems and patterns to quickly revisit them later.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/problems"
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500"
            >
              Browse Problems <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/patterns"
              className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-700"
            >
              Browse Patterns <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Problems Section */}
      {problems.length > 0 && (
        <section className="mb-10">
          <div className="mb-4 flex items-center gap-2">
            <Code2 className="h-5 w-5 text-blue-400" />
            <h2 className="text-xl font-semibold text-white">LLD Problems</h2>
            <span className="rounded-full bg-blue-500/10 px-2 py-0.5 text-xs text-blue-400">
              {problems.length}
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {problems.map((item) => (
              <div
                key={item.id}
                className="group flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-4 transition-all hover:border-zinc-700"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
                  <Code2 className="h-5 w-5 text-blue-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/problems/${item.slug}`}
                    className="block truncate text-sm font-semibold text-white hover:text-blue-400 transition-colors"
                  >
                    {item.title}
                  </Link>
                  {item.subtitle && (
                    <p className="text-xs text-zinc-500">{item.subtitle}</p>
                  )}
                </div>
                <button
                  onClick={() => remove(item.id)}
                  className="shrink-0 rounded-lg p-1.5 text-zinc-600 opacity-0 transition-all hover:bg-zinc-800 hover:text-red-400 group-hover:opacity-100"
                  aria-label="Remove bookmark"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Patterns Section */}
      {patterns.length > 0 && (
        <section>
          <div className="mb-4 flex items-center gap-2">
            <Layers className="h-5 w-5 text-purple-400" />
            <h2 className="text-xl font-semibold text-white">Design Patterns</h2>
            <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-xs text-purple-400">
              {patterns.length}
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {patterns.map((item) => (
              <div
                key={item.id}
                className="group flex items-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900 p-4 transition-all hover:border-zinc-700"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-purple-500/10">
                  <Layers className="h-5 w-5 text-purple-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/patterns/${item.slug}`}
                    className="block truncate text-sm font-semibold text-white hover:text-purple-400 transition-colors"
                  >
                    {item.title}
                  </Link>
                  {item.subtitle && (
                    <p className="text-xs text-zinc-500">{item.subtitle}</p>
                  )}
                </div>
                <button
                  onClick={() => remove(item.id)}
                  className="shrink-0 rounded-lg p-1.5 text-zinc-600 opacity-0 transition-all hover:bg-zinc-800 hover:text-red-400 group-hover:opacity-100"
                  aria-label="Remove bookmark"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
