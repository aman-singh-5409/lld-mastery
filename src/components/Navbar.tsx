'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { BookOpen, Code2, Layers, Search, X, Menu, Bookmark } from 'lucide-react';
import SearchModal from './SearchModal';

const navLinks = [
  { href: '/problems', label: 'Problems', icon: Code2 },
  { href: '/patterns', label: 'Patterns', icon: Layers },
  { href: '/oop', label: 'OOP Concepts', icon: BookOpen },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  // Global Cmd+K / Ctrl+K shortcut
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  return (
    <>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />

      <nav className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/90 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                <Code2 className="h-4 w-4 text-white" />
              </div>
              <span className="text-lg font-bold text-white hidden sm:block">
                LLD<span className="text-blue-400">Mastery</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map(({ href, label, icon: Icon }) => {
                const isActive = pathname.startsWith(href);
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-blue-600/20 text-blue-400'
                        : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </Link>
                );
              })}
            </div>

            {/* Right side: Search + Bookmarks */}
            <div className="flex items-center gap-2">
              {/* Search Trigger */}
              <button
                onClick={() => setSearchOpen(true)}
                className="hidden sm:flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-sm text-zinc-400 hover:border-zinc-600 hover:text-zinc-300 transition-colors"
                aria-label="Open search"
              >
                <Search className="h-3.5 w-3.5" />
                <span className="hidden md:inline text-zinc-500">Search...</span>
                <kbd className="hidden md:inline-flex h-5 items-center rounded border border-zinc-700 px-1 text-xs text-zinc-600">
                  ⌘K
                </kbd>
              </button>

              {/* Bookmarks */}
              <Link
                href="/bookmarks"
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  pathname === '/bookmarks'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                }`}
                aria-label="Bookmarks"
              >
                <Bookmark className="h-4 w-4" />
                <span className="hidden lg:inline">Saved</span>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden rounded-lg p-2 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-zinc-800 py-3">
              {/* Mobile Search */}
              <button
                onClick={() => { setSearchOpen(true); setMobileMenuOpen(false); }}
                className="mb-3 flex w-full items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-400"
              >
                <Search className="h-4 w-4" />
                Search everything...
              </button>

              {/* Mobile Links */}
              <div className="flex flex-col gap-1">
                {navLinks.map(({ href, label, icon: Icon }) => {
                  const isActive = pathname.startsWith(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-blue-600/20 text-blue-400'
                          : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {label}
                    </Link>
                  );
                })}
                <Link
                  href="/bookmarks"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                    pathname === '/bookmarks'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                  }`}
                >
                  <Bookmark className="h-4 w-4" />
                  Saved
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
