import Link from 'next/link';
import { Pattern } from '@/data/patterns';
import { ArrowRight } from 'lucide-react';

interface PatternCardProps {
  pattern: Pattern;
}

const categoryConfig = {
  Creational: {
    color: 'text-emerald-400',
    bg: 'bg-emerald-400/10',
    border: 'border-emerald-400/20',
    dot: 'bg-emerald-400',
  },
  Structural: {
    color: 'text-blue-400',
    bg: 'bg-blue-400/10',
    border: 'border-blue-400/20',
    dot: 'bg-blue-400',
  },
  Behavioral: {
    color: 'text-purple-400',
    bg: 'bg-purple-400/10',
    border: 'border-purple-400/20',
    dot: 'bg-purple-400',
  },
};

export default function PatternCard({ pattern }: PatternCardProps) {
  const config = categoryConfig[pattern.category];

  return (
    <Link href={`/patterns/${pattern.slug}`} className="group block">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 transition-all duration-200 hover:border-zinc-600 hover:bg-zinc-800/50 hover:shadow-lg">
        {/* Category Badge */}
        <div className="mb-3 flex items-center justify-between">
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${config.bg} ${config.border} ${config.color}`}>
            <span className={`h-1.5 w-1.5 rounded-full ${config.dot}`} />
            {pattern.category}
          </span>
          <ArrowRight className="h-4 w-4 text-zinc-600 group-hover:text-zinc-300 transition-colors" />
        </div>

        {/* Name */}
        <h3 className="mb-2 text-base font-semibold text-white group-hover:text-blue-400 transition-colors">
          {pattern.name}
        </h3>

        {/* Description */}
        <p className="mb-4 text-sm text-zinc-400 line-clamp-3 leading-relaxed">
          {pattern.description}
        </p>

        {/* Use cases preview */}
        <div className="space-y-1">
          {pattern.useCases.slice(0, 2).map((useCase) => (
            <div key={useCase} className="flex items-start gap-2 text-xs text-zinc-500">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-zinc-600" />
              <span className="line-clamp-1">{useCase}</span>
            </div>
          ))}
          {pattern.useCases.length > 2 && (
            <div className="text-xs text-zinc-600">
              +{pattern.useCases.length - 2} more use cases
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
