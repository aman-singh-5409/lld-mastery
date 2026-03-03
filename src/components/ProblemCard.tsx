import Link from 'next/link';
import { Problem } from '@/data/problems';
import { ArrowRight, Tag } from 'lucide-react';

interface ProblemCardProps {
  problem: Problem;
  completed?: boolean;
}

const difficultyConfig = {
  Easy: { color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20' },
  Medium: { color: 'text-yellow-400', bg: 'bg-yellow-400/10', border: 'border-yellow-400/20' },
  Hard: { color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20' },
};

const categoryColors: Record<string, string> = {
  'System Design': 'text-blue-400',
  'State Machine': 'text-purple-400',
  'Data Structures': 'text-cyan-400',
  'Social Platform': 'text-pink-400',
  'Infrastructure': 'text-orange-400',
  'Games': 'text-lime-400',
  'Messaging': 'text-indigo-400',
  'Banking': 'text-emerald-400',
  'Business Systems': 'text-amber-400',
  'Finance': 'text-teal-400',
  'E-Commerce': 'text-rose-400',
  'Media Streaming': 'text-violet-400',
  'On-Demand Services': 'text-sky-400',
  'Booking Systems': 'text-fuchsia-400',
  'Productivity': 'text-yellow-300',
};

export default function ProblemCard({ problem, completed = false }: ProblemCardProps) {
  const diff = difficultyConfig[problem.difficulty];
  const catColor = categoryColors[problem.category] ?? 'text-zinc-400';

  return (
    <Link href={`/problems/${problem.slug}`} className="group block">
      <div className={`relative rounded-xl border bg-zinc-900 p-5 transition-all duration-200 hover:border-blue-500/50 hover:bg-zinc-800/50 hover:shadow-lg hover:shadow-blue-500/5 ${completed ? 'border-green-500/30' : 'border-zinc-800'}`}>
        {/* Completion indicator */}
        {completed && (
          <div className="absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
            <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}

        {/* Header */}
        <div className="mb-3">
          <div className="mb-1 flex items-center gap-2">
            <span className={`text-xs font-medium ${catColor}`}>{problem.category}</span>
            <span className="text-zinc-700">•</span>
            <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium ${diff.bg} ${diff.border} ${diff.color}`}>
              {problem.difficulty}
            </span>
          </div>
          <h3 className="text-base font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
            {problem.title}
          </h3>
        </div>

        {/* Description */}
        <p className="mb-4 text-sm text-zinc-400 line-clamp-2 leading-relaxed">
          {problem.description}
        </p>

        {/* Patterns */}
        {problem.patterns.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-1.5">
            {problem.patterns.slice(0, 3).map((pattern) => (
              <span
                key={pattern}
                className="flex items-center gap-1 rounded-md bg-blue-500/10 px-2 py-0.5 text-xs text-blue-300 border border-blue-500/20"
              >
                <Tag className="h-2.5 w-2.5" />
                {pattern}
              </span>
            ))}
            {problem.patterns.length > 3 && (
              <span className="rounded-md bg-zinc-700/50 px-2 py-0.5 text-xs text-zinc-400">
                +{problem.patterns.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {problem.languages.slice(0, 4).map((lang) => (
              <span key={lang} className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-500">
                {lang}
              </span>
            ))}
            {problem.languages.length > 4 && (
              <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-500">
                +{problem.languages.length - 4}
              </span>
            )}
          </div>
          <ArrowRight className="h-4 w-4 text-zinc-600 group-hover:text-blue-400 transition-colors" />
        </div>
      </div>
    </Link>
  );
}
