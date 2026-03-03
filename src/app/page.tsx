import Link from 'next/link';
import { problems } from '@/data/problems';
import { patterns } from '@/data/patterns';
import { oopConcepts } from '@/data/oop';
import { ArrowRight, BookOpen, Code2, Layers, Zap, Target, Trophy } from 'lucide-react';

const difficultyCount = {
  Easy: problems.filter((p) => p.difficulty === 'Easy').length,
  Medium: problems.filter((p) => p.difficulty === 'Medium').length,
  Hard: problems.filter((p) => p.difficulty === 'Hard').length,
};

const featuredProblems = problems.slice(0, 4);

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <section className="mb-16 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-1.5 text-sm text-blue-400">
          <Zap className="h-3.5 w-3.5" />
          Master Low Level Design
        </div>

        <h1 className="mb-6 text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
          Design Systems{' '}
          <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Like an Expert
          </span>
        </h1>

        <p className="mx-auto mb-8 max-w-2xl text-lg text-zinc-400 leading-relaxed">
          Learn Low Level Design through hands-on problems, design patterns, and OOP concepts.
          Build your skills from basics to complex systems with real code examples.
        </p>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link
            href="/problems"
            className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
          >
            Start Practicing
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/patterns"
            className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/50 px-6 py-3 text-sm font-semibold text-zinc-300 transition-colors hover:border-zinc-600 hover:bg-zinc-800"
          >
            Explore Patterns
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="mb-16">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { label: 'LLD Problems', value: problems.length, icon: Code2, color: 'text-blue-400' },
            { label: 'Design Patterns', value: patterns.length, icon: Layers, color: 'text-purple-400' },
            { label: 'OOP Concepts', value: oopConcepts.length, icon: BookOpen, color: 'text-emerald-400' },
            { label: 'Languages', value: 6, icon: Target, color: 'text-orange-400' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div
              key={label}
              className="rounded-xl border border-zinc-800 bg-zinc-900 p-5 text-center"
            >
              <Icon className={`mx-auto mb-2 h-6 w-6 ${color}`} />
              <div className="text-3xl font-bold text-white">{value}+</div>
              <div className="mt-1 text-sm text-zinc-400">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Difficulty Breakdown */}
      <section className="mb-16">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-6">
          <h2 className="mb-4 text-lg font-semibold text-white">Problems by Difficulty</h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            {[
              { label: 'Easy', count: difficultyCount.Easy, color: 'bg-green-400', textColor: 'text-green-400' },
              { label: 'Medium', count: difficultyCount.Medium, color: 'bg-yellow-400', textColor: 'text-yellow-400' },
              { label: 'Hard', count: difficultyCount.Hard, color: 'bg-red-400', textColor: 'text-red-400' },
            ].map(({ label, count, color, textColor }) => (
              <div key={label} className="flex-1">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className={`text-sm font-medium ${textColor}`}>{label}</span>
                  <span className="text-sm text-zinc-400">{count} problems</span>
                </div>
                <div className="h-2.5 overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className={`h-full rounded-full ${color}`}
                    style={{ width: `${(count / problems.length) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="mb-16">
        <h2 className="mb-6 text-2xl font-bold text-white">What You Will Learn</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {/* Problems */}
          <div className="group rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition-all hover:border-blue-500/40">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10">
              <Code2 className="h-6 w-6 text-blue-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">LLD Problems</h3>
            <p className="mb-4 text-sm text-zinc-400 leading-relaxed">
              Tackle {problems.length}+ real-world system design problems. From parking lots to
              social networks, each problem includes requirements, class diagrams, and working code.
            </p>
            <div className="mb-4 flex gap-2">
              <span className="rounded-full bg-green-500/10 px-2.5 py-0.5 text-xs text-green-400">
                {difficultyCount.Easy} Easy
              </span>
              <span className="rounded-full bg-yellow-500/10 px-2.5 py-0.5 text-xs text-yellow-400">
                {difficultyCount.Medium} Medium
              </span>
              <span className="rounded-full bg-red-500/10 px-2.5 py-0.5 text-xs text-red-400">
                {difficultyCount.Hard} Hard
              </span>
            </div>
            <Link
              href="/problems"
              className="flex items-center gap-1.5 text-sm font-medium text-blue-400 hover:text-blue-300"
            >
              Browse Problems <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Patterns */}
          <div className="group rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition-all hover:border-purple-500/40">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10">
              <Layers className="h-6 w-6 text-purple-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">Design Patterns</h3>
            <p className="mb-4 text-sm text-zinc-400 leading-relaxed">
              Master all {patterns.length} Gang of Four design patterns with detailed explanations,
              real-world use cases, pros/cons, and Python code examples.
            </p>
            <div className="mb-4 flex gap-2 flex-wrap">
              {['Creational', 'Structural', 'Behavioral'].map((cat) => (
                <span
                  key={cat}
                  className="rounded-full bg-purple-500/10 px-2.5 py-0.5 text-xs text-purple-400"
                >
                  {cat}
                </span>
              ))}
            </div>
            <Link
              href="/patterns"
              className="flex items-center gap-1.5 text-sm font-medium text-purple-400 hover:text-purple-300"
            >
              Explore Patterns <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* OOP */}
          <div className="group rounded-xl border border-zinc-800 bg-zinc-900 p-6 transition-all hover:border-emerald-500/40 sm:col-span-2 lg:col-span-1">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10">
              <BookOpen className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-white">OOP Fundamentals</h3>
            <p className="mb-4 text-sm text-zinc-400 leading-relaxed">
              Build a solid foundation with the four pillars of OOP, SOLID principles,
              composition vs inheritance, coupling and cohesion, and more.
            </p>
            <div className="mb-4 flex flex-wrap gap-2">
              {['Encapsulation', 'Inheritance', 'Polymorphism', 'Abstraction'].map((concept) => (
                <span
                  key={concept}
                  className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs text-emerald-400"
                >
                  {concept}
                </span>
              ))}
            </div>
            <Link
              href="/oop"
              className="flex items-center gap-1.5 text-sm font-medium text-emerald-400 hover:text-emerald-300"
            >
              Learn OOP <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Problems */}
      <section className="mb-16">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Featured Problems</h2>
          <Link
            href="/problems"
            className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {featuredProblems.map((problem) => (
            <Link
              key={problem.id}
              href={`/problems/${problem.slug}`}
              className="group flex items-start gap-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4 transition-all hover:border-zinc-700 hover:bg-zinc-800/50"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
                <Code2 className="h-5 w-5 text-blue-400" />
              </div>
              <div className="min-w-0">
                <div className="mb-1 flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-white group-hover:text-blue-400 transition-colors truncate">
                    {problem.title}
                  </h3>
                  <span
                    className={`shrink-0 rounded text-xs px-1.5 py-0.5 font-medium ${
                      problem.difficulty === 'Easy'
                        ? 'bg-green-400/10 text-green-400'
                        : problem.difficulty === 'Medium'
                        ? 'bg-yellow-400/10 text-yellow-400'
                        : 'bg-red-400/10 text-red-400'
                    }`}
                  >
                    {problem.difficulty}
                  </span>
                </div>
                <p className="text-xs text-zinc-500 line-clamp-2">{problem.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Learning Path */}
      <section className="mb-12">
        <div className="rounded-xl border border-zinc-800 bg-gradient-to-r from-blue-900/20 to-purple-900/20 p-8 text-center">
          <Trophy className="mx-auto mb-4 h-10 w-10 text-yellow-400" />
          <h2 className="mb-3 text-2xl font-bold text-white">Start Your LLD Journey</h2>
          <p className="mx-auto mb-6 max-w-lg text-zinc-400">
            Whether you are preparing for interviews or just want to become a better engineer,
            mastering LLD is essential. Start with easy problems and work your way up.
          </p>
          <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/oop"
              className="rounded-lg border border-zinc-700 bg-zinc-800 px-5 py-2.5 text-sm font-medium text-zinc-200 hover:bg-zinc-700"
            >
              1. Learn OOP Basics
            </Link>
            <ArrowRight className="hidden h-4 w-4 text-zinc-500 sm:block" />
            <Link
              href="/patterns"
              className="rounded-lg border border-zinc-700 bg-zinc-800 px-5 py-2.5 text-sm font-medium text-zinc-200 hover:bg-zinc-700"
            >
              2. Study Design Patterns
            </Link>
            <ArrowRight className="hidden h-4 w-4 text-zinc-500 sm:block" />
            <Link
              href="/problems"
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-500"
            >
              3. Solve LLD Problems
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
