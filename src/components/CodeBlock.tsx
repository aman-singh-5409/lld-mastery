'use client';

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Copy } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const currentCode = tabs ? tabs[activeTab].code : (code ?? '');
  const currentLanguage = tabs ? languageMap[tabs[activeTab].language.toLowerCase()] ?? tabs[activeTab].language : languageMap[language.toLowerCase()] ?? language;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API failed, ignore
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-700 bg-zinc-800/50 px-4 py-2">
        <div className="flex items-center gap-3">
          {/* Window dots */}
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500/70" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/70" />
            <div className="h-3 w-3 rounded-full bg-green-500/70" />
          </div>
          {title && <span className="text-xs text-zinc-400">{title}</span>}
        </div>

        {/* Language tabs */}
        {tabs && tabs.length > 1 && (
          <div className="flex gap-1 overflow-x-auto">
            {tabs.map((tab, idx) => (
              <button
                key={tab.language}
                onClick={() => setActiveTab(idx)}
                className={`rounded px-2.5 py-1 text-xs font-medium transition-colors whitespace-nowrap ${
                  activeTab === idx
                    ? 'bg-blue-600 text-white'
                    : 'text-zinc-400 hover:bg-zinc-700 hover:text-zinc-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded px-2 py-1 text-xs text-zinc-400 transition-colors hover:bg-zinc-700 hover:text-zinc-200"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-green-400" />
              <span className="text-green-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <div className="overflow-x-auto">
        <SyntaxHighlighter
          language={currentLanguage}
          style={oneDark}
          customStyle={{
            margin: 0,
            background: 'transparent',
            padding: '1rem',
            fontSize: '0.8125rem',
            lineHeight: '1.6',
          }}
          showLineNumbers
          lineNumberStyle={{
            color: '#4b5563',
            paddingRight: '1rem',
            minWidth: '2.5rem',
            userSelect: 'none',
          }}
          wrapLines={false}
        >
          {currentCode}
        </SyntaxHighlighter>
      </div>
    </div>
  );
}
