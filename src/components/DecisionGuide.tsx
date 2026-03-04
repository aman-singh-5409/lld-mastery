'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ThumbsUp, CheckSquare, AlertTriangle, Zap, ArrowRight } from 'lucide-react';
import type { PatternDecisionGuide } from '@/data/patterns';

interface DecisionGuideProps {
  guide: PatternDecisionGuide;
  categoryColor: { text: string; bg: string; border: string };
}

const complexityColors: Record<string, string> = {
  Low: 'bg-green-400/15 text-green-400 border border-green-400/30',
  Medium: 'bg-yellow-400/15 text-yellow-400 border border-yellow-400/30',
  High: 'bg-red-400/15 text-red-400 border border-red-400/30',
};

export default function DecisionGuide({ guide, categoryColor }: DecisionGuideProps) {
  const [checked, setChecked] = useState<boolean[]>(() =>
    Array(guide.useWhen.length).fill(false)
  );

  const checkedCount = checked.filter(Boolean).length;
  const total = guide.useWhen.length;
  const pct = total > 0 ? (checkedCount / total) * 100 : 0;

  const toggle = (i: number) =>
    setChecked((prev) => prev.map((v, idx) => (idx === i ? !v : v)));

  let recommendation: { text: string; color: string } | null = null;
  if (checkedCount > 0) {
    if (pct >= 75) {
      recommendation = {
        text: 'Strong fit — this pattern suits your situation',
        color: 'text-green-400',
      };
    } else if (pct >= 50) {
      recommendation = {
        text: 'Possible fit — review the tradeoffs carefully',
        color: 'text-yellow-400',
      };
    } else {
      recommendation = {
        text: 'Consider alternatives below',
        color: 'text-zinc-400',
      };
    }
  }

  return (
    <section>
      <h2 className="mb-4 text-xl font-semibold text-white">When to Use This Pattern</h2>
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 space-y-6">

        {/* Block 1: Good Fit Signals */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <ThumbsUp className="h-4 w-4 text-blue-400" />
            <h3 className="text-sm font-semibold text-zinc-200">Good Fit Signals</h3>
          </div>
          <ul className="space-y-2">
            {guide.goodFitSignals.map((signal) => (
              <li key={signal} className="flex items-start gap-2.5 text-sm text-zinc-400">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                {signal}
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-zinc-800" />

        {/* Block 2: Use When checklist */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <CheckSquare className="h-4 w-4 text-green-400" />
            <h3 className="text-sm font-semibold text-zinc-200">Use When</h3>
          </div>
          <ul className="space-y-2.5 mb-4">
            {guide.useWhen.map((condition, i) => (
              <li key={condition}>
                <label className="flex cursor-pointer items-start gap-3 text-sm">
                  <input
                    type="checkbox"
                    checked={checked[i]}
                    onChange={() => toggle(i)}
                    className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-green-400"
                  />
                  <span className={checked[i] ? 'text-zinc-200' : 'text-zinc-400'}>
                    {condition}
                  </span>
                </label>
              </li>
            ))}
          </ul>

          {/* Progress bar */}
          <div className="h-1.5 w-full rounded-full bg-zinc-800 overflow-hidden">
            <div
              className="h-full rounded-full bg-green-400 transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-zinc-500">
            <span>{checkedCount}/{total} conditions met</span>
            {recommendation && (
              <span className={`font-medium ${recommendation.color}`}>
                {recommendation.text}
              </span>
            )}
          </div>
        </div>

        <div className="border-t border-zinc-800" />

        {/* Block 3: Avoid When */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            <h3 className="text-sm font-semibold text-zinc-200">Avoid When</h3>
          </div>
          <ul className="space-y-2">
            {guide.avoidWhen.map((condition) => (
              <li key={condition} className="flex items-start gap-2.5 text-sm text-zinc-400">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-red-400" />
                {condition}
              </li>
            ))}
          </ul>
        </div>

        <div className="border-t border-zinc-800" />

        {/* Block 4: Complexity + Bottom Line */}
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Zap className="h-4 w-4 text-zinc-400" />
            <h3 className="text-sm font-semibold text-zinc-200">Complexity</h3>
            <span
              className={`ml-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${complexityColors[guide.complexity]}`}
            >
              {guide.complexity}
            </span>
          </div>
          <div
            className={`rounded-lg border p-3.5 ${categoryColor.bg} ${categoryColor.border}`}
          >
            <p className={`text-sm italic leading-relaxed ${categoryColor.text}`}>
              {guide.bottomLine}
            </p>
          </div>
        </div>

        {/* Block 5: Consider Instead */}
        {guide.alternatives.length > 0 && (
          <>
            <div className="border-t border-zinc-800" />
            <div>
              <div className="mb-3 flex items-center gap-2">
                <ArrowRight className="h-4 w-4 text-zinc-400" />
                <h3 className="text-sm font-semibold text-zinc-200">Consider Instead</h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {guide.alternatives.map((alt) => (
                  <Link
                    key={alt.slug}
                    href={`/patterns/${alt.slug}`}
                    className="group rounded-lg border border-zinc-800 bg-zinc-950 p-3.5 hover:border-zinc-700 hover:bg-zinc-800 transition-colors"
                  >
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <span className="text-sm font-medium text-zinc-200 group-hover:text-white">
                        {alt.name}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                    </div>
                    <p className="text-xs text-zinc-500 leading-relaxed">{alt.reason}</p>
                  </Link>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
