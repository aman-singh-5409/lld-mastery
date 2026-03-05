'use client';

import { useState, useEffect } from 'react';
import { Bookmark, BookmarkCheck } from 'lucide-react';

export type BookmarkType = 'problem' | 'pattern';

export interface BookmarkItem {
  type: BookmarkType;
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
}

const STORAGE_KEY = 'lld-mastery-bookmarks';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) setBookmarks(JSON.parse(stored));
    } catch {
      // localStorage not available
    }
  }, []);

  const isBookmarked = (id: string) => bookmarks.some((b) => b.id === id);

  const toggle = (item: BookmarkItem) => {
    setBookmarks((prev) => {
      const exists = prev.some((b) => b.id === item.id);
      const next = exists ? prev.filter((b) => b.id !== item.id) : [...prev, item];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // localStorage not available
      }
      return next;
    });
  };

  const remove = (id: string) => {
    setBookmarks((prev) => {
      const next = prev.filter((b) => b.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch {
        // localStorage not available
      }
      return next;
    });
  };

  return { bookmarks, isBookmarked, toggle, remove };
}

interface BookmarkButtonProps {
  item: BookmarkItem;
}

export default function BookmarkButton({ item }: BookmarkButtonProps) {
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const items: BookmarkItem[] = JSON.parse(stored);
        setBookmarked(items.some((b) => b.id === item.id));
      }
    } catch {
      // localStorage not available
    }
  }, [item.id]);

  const toggle = () => {
    const next = !bookmarked;
    setBookmarked(next);
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const items: BookmarkItem[] = stored ? JSON.parse(stored) : [];
      const updated = next
        ? [...items.filter((b) => b.id !== item.id), item]
        : items.filter((b) => b.id !== item.id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // localStorage not available
    }
  };

  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
        bookmarked
          ? 'border-yellow-500/40 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20'
          : 'border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-700'
      }`}
      aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark this'}
    >
      {bookmarked ? (
        <BookmarkCheck className="h-4 w-4" />
      ) : (
        <Bookmark className="h-4 w-4" />
      )}
      {bookmarked ? 'Bookmarked' : 'Bookmark'}
    </button>
  );
}
