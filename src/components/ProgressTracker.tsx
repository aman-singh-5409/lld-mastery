'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, Circle } from 'lucide-react';

interface ProgressTrackerProps {
  problemId: string;
  problemTitle: string;
}

export function useProgress() {
  const [completedProblems, setCompletedProblems] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      const stored = localStorage.getItem('lld-mastery-progress');
      if (stored) {
        setCompletedProblems(new Set(JSON.parse(stored)));
      }
    } catch {
      // localStorage not available
    }
  }, []);

  const toggleProblem = (problemId: string) => {
    setCompletedProblems((prev) => {
      const next = new Set(prev);
      if (next.has(problemId)) {
        next.delete(problemId);
      } else {
        next.add(problemId);
      }
      try {
        localStorage.setItem('lld-mastery-progress', JSON.stringify([...next]));
      } catch {
        // localStorage not available
      }
      return next;
    });
  };

  const isCompleted = (problemId: string) => completedProblems.has(problemId);

  return { completedProblems, toggleProblem, isCompleted };
}

export default function ProgressTracker({ problemId, problemTitle }: ProgressTrackerProps) {
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('lld-mastery-progress');
      if (stored) {
        const ids: string[] = JSON.parse(stored);
        setCompleted(ids.includes(problemId));
      }
    } catch {
      // localStorage not available
    }
  }, [problemId]);

  const toggle = () => {
    const next = !completed;
    setCompleted(next);
    try {
      const stored = localStorage.getItem('lld-mastery-progress');
      const ids: string[] = stored ? JSON.parse(stored) : [];
      const updated = next
        ? [...new Set([...ids, problemId])]
        : ids.filter((id) => id !== problemId);
      localStorage.setItem('lld-mastery-progress', JSON.stringify(updated));
    } catch {
      // localStorage not available
    }
  };

  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all ${
        completed
          ? 'border-green-500/40 bg-green-500/10 text-green-400 hover:bg-green-500/20'
          : 'border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-zinc-600 hover:bg-zinc-700'
      }`}
      aria-label={completed ? 'Mark as incomplete' : 'Mark as complete'}
    >
      {completed ? (
        <CheckCircle className="h-4 w-4" />
      ) : (
        <Circle className="h-4 w-4" />
      )}
      {completed ? 'Completed' : 'Mark Complete'}
    </button>
  );
}

// Stats component showing overall progress
export function ProgressStats({ total }: { total: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('lld-mastery-progress');
      if (stored) {
        const ids: string[] = JSON.parse(stored);
        setCount(ids.length);
      }
    } catch {
      // localStorage not available
    }
  }, []);

  const percentage = total > 0 ? Math.round((count / total) * 100) : 0;

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-300">Your Progress</span>
        <span className="text-sm text-zinc-400">
          {count} / {total}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-zinc-700">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <p className="mt-1.5 text-right text-xs text-zinc-500">{percentage}% complete</p>
    </div>
  );
}
