import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { SystemDesignTopic } from '@/data/systemDesign';

interface SystemDesignCardProps {
  topic: SystemDesignTopic;
}

const difficultyColor: Record<string, string> = {
  Easy: 'text-green-400 bg-green-400/10',
  Medium: 'text-yellow-400 bg-yellow-400/10',
  Hard: 'text-red-400 bg-red-400/10',
};

export default function SystemDesignCard({ topic }: SystemDesignCardProps) {
  return (
    <Link href={`/system-design/${topic.slug}`} className="group block">
      <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 transition-all duration-200 hover:border-zinc-600 hover:bg-zinc-800/50 hover:shadow-lg">
        <div className="mb-3 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-xs font-medium text-cyan-400">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
            {topic.category}
          </span>
          {topic.difficulty && (
            <span className={`rounded px-1.5 py-0.5 text-xs font-medium ${difficultyColor[topic.difficulty]}`}>
              {topic.difficulty}
            </span>
          )}
        </div>

        <h3 className="mb-2 text-base font-semibold text-white group-hover:text-cyan-400 transition-colors">
          {topic.title}
        </h3>

        <p className="mb-4 text-sm text-zinc-400 line-clamp-3 leading-relaxed">{topic.summary}</p>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1.5">
            {topic.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="rounded bg-zinc-800 px-1.5 py-0.5 text-xs text-zinc-500">
                {tag}
              </span>
            ))}
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-zinc-600 group-hover:text-zinc-300 transition-colors" />
        </div>
      </div>
    </Link>
  );
}
