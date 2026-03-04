'use client';

import { useState, useEffect, useCallback } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Copy, Maximize2, Minimize2 } from 'lucide-react';
import { useLanguage, type SupportedLanguage } from '@/context/LanguageContext';

interface CodeTab {
  language: string;
  label: string;
  code: string;
}

interface CodeBlockProps {
  tabs?: CodeTab[];
  code?: string;
  language?: string;
  title?: string;
}

const languageMap: Record<string, string> = {
  python: 'python',
  java: 'java',
  'c++': 'cpp',
  cpp: 'cpp',
  'c#': 'csharp',
  csharp: 'csharp',
  go: 'go',
  typescript: 'typescript',
  javascript: 'javascript',
};

export default function CodeBlock({ tabs, code, language = 'python', title }: CodeBlockProps) {
  const { language: globalLang, setLanguage } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const activeTabIdx = tabs
    ? (() => {
        const idx = tabs.findIndex(
          (t) => t.language.toLowerCase() === globalLang || languageMap[t.language.toLowerCase()] === globalLang
        );
        return idx >= 0 ? idx : 0;
      })()
    : 0;

  const currentCode = tabs ? tabs[activeTabIdx].code : (code ?? '');
  const currentLanguage = tabs
    ? languageMap[tabs[activeTabIdx].language.toLowerCase()] ?? tabs[activeTabIdx].language
    : languageMap[language.toLowerCase()] ?? language;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleTabClick = (tab: CodeTab) => {
    setLanguage(tab.language.toLowerCase() as SupportedLanguage);
  };

  const openFullscreen = () => {
    setIsFullscreen(true);
    // Trigger enter animation on next frame
    requestAnimationFrame(() => setIsVisible(true));
  };

  const closeFullscreen = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => setIsFullscreen(false), 250);
  }, []);

  // Close on Escape key
  useEffect(() => {
    if (!isFullscreen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') closeFullscreen(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isFullscreen, closeFullscreen]);

  // Prevent body scroll when fullscreen
  useEffect(() => {
    document.body.style.overflow = isFullscreen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isFullscreen]);

  const header = (fullscreen = false) => (
    <div className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/60 px-4 py-2.5 backdrop-blur-sm shrink-0">
      <div className="flex items-center gap-3">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-red-500/80 shadow-sm shadow-red-500/30" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/80 shadow-sm shadow-yellow-500/30" />
          <div className="h-3 w-3 rounded-full bg-green-500/80 shadow-sm shadow-green-500/30" />
        </div>
        {title && (
          <span className="text-xs text-zinc-500 font-medium tracking-wide">{title}</span>
        )}
      </div>

      {tabs && tabs.length > 1 && (
        <div className="flex gap-0.5">
          {tabs.map((tab, idx) => {
            const isActive = idx === activeTabIdx;
            return (
              <button
                key={tab.language}
                onClick={() => handleTabClick(tab)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-zinc-700/80 text-zinc-100 shadow-sm'
                    : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      )}

      <div className="flex items-center gap-1">
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs text-zinc-500 transition-all hover:bg-zinc-800 hover:text-zinc-200"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>

        <button
          onClick={fullscreen ? closeFullscreen : openFullscreen}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs text-zinc-500 transition-all hover:bg-zinc-800 hover:text-zinc-200 cursor-pointer"
          aria-label={fullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        >
          {fullscreen
            ? <Minimize2 className="h-3.5 w-3.5" />
            : <Maximize2 className="h-3.5 w-3.5" />
          }
        </button>
      </div>
    </div>
  );

  const codeBody = (fullscreen = false) => (
    <div className={`overflow-auto ${fullscreen ? 'flex-1' : ''}`}>
      <SyntaxHighlighter
        language={currentLanguage}
        style={vscDarkPlus}
        showLineNumbers
        customStyle={{
          margin: 0,
          background: 'transparent',
          padding: '1rem 0',
          fontSize: '0.8rem',
          lineHeight: '1.7',
          height: fullscreen ? '100%' : undefined,
        }}
        lineNumberStyle={{
          color: '#4b5563',
          paddingRight: '1.25rem',
          minWidth: '3rem',
          textAlign: 'right',
          userSelect: 'none',
        }}
        wrapLines={false}
      >
        {currentCode}
      </SyntaxHighlighter>
    </div>
  );

  return (
    <>
      {/* Inline block */}
      <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#1e1e1e] shadow-2xl shadow-black/50">
        {header(false)}
        {codeBody(false)}
      </div>

      {/* Fullscreen overlay */}
      {isFullscreen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 transition-all duration-250"
          style={{
            backgroundColor: isVisible ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0)',
            backdropFilter: isVisible ? 'blur(6px)' : 'blur(0px)',
            WebkitBackdropFilter: isVisible ? 'blur(6px)' : 'blur(0px)',
          }}
          onClick={(e) => { if (e.target === e.currentTarget) closeFullscreen(); }}
        >
          <div
            className="flex flex-col w-full h-full max-w-7xl max-h-[92vh] overflow-hidden rounded-2xl border border-zinc-700 bg-[#1e1e1e] shadow-2xl shadow-black/80 transition-all duration-250"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'scale(1)' : 'scale(0.96)',
            }}
          >
            {header(true)}
            {codeBody(true)}
          </div>
        </div>
      )}
    </>
  );
}
