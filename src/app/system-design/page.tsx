import { getFundamentals, getCaseStudies } from '@/data/systemDesign';
import SystemDesignCard from '@/components/SystemDesignCard';
import { Network } from 'lucide-react';
import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site-config';

const title = 'System Design — Fundamentals & Case Studies';
const description =
  'Learn system design from first principles: scaling, caching, sharding, consistent hashing, CAP theorem, rate limiting, and message queues — then apply them in real case studies like URL shorteners, chat systems, news feeds, and distributed key-value stores.';

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    'System Design',
    'HLD',
    'High Level Design',
    'Distributed Systems',
    'Scalability',
    'CAP Theorem',
    'Consistent Hashing',
    'Load Balancing',
    'Caching',
    'Rate Limiting',
    'System Design Interview',
  ],
  alternates: { canonical: `${siteConfig.url}/system-design` },
  openGraph: {
    title,
    description,
    url: `${siteConfig.url}/system-design`,
    siteName: siteConfig.name,
    images: [
      {
        url: `/api/og?title=${encodeURIComponent('System Design')}&subtitle=${encodeURIComponent(description)}&type=default`,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: [`/api/og?title=${encodeURIComponent('System Design')}&subtitle=${encodeURIComponent(description)}&type=default`],
  },
};

export default function SystemDesignPage() {
  const fundamentals = getFundamentals();
  const caseStudies = getCaseStudies();

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-10">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10">
            <Network className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">System Design</h1>
            <p className="text-zinc-400">
              {fundamentals.length} core fundamentals and {caseStudies.length} real-world case studies
            </p>
          </div>
        </div>
        <p className="max-w-3xl text-sm text-zinc-500 leading-relaxed">
          Start with the fundamentals — the building blocks every large system is assembled from — then
          see them combined in full case studies. Each topic includes an architecture walkthrough,
          trade-offs, common pitfalls, and interview tips.
        </p>
      </div>

      {/* Fundamentals */}
      <section className="mb-14">
        <div className="mb-5 flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-cyan-400" />
          <h2 className="text-xl font-bold text-cyan-400">Fundamentals</h2>
          <span className="text-sm text-zinc-500">({fundamentals.length})</span>
        </div>
        <p className="mb-5 max-w-2xl text-sm text-zinc-500">
          The reusable building blocks — read these in order if you are starting from scratch.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {fundamentals.map((topic) => (
            <SystemDesignCard key={topic.id} topic={topic} />
          ))}
        </div>
      </section>

      {/* Case Studies */}
      <section>
        <div className="mb-5 flex items-center gap-3">
          <span className="h-2 w-2 rounded-full bg-blue-400" />
          <h2 className="text-xl font-bold text-blue-400">Case Studies</h2>
          <span className="text-sm text-zinc-500">({caseStudies.length})</span>
        </div>
        <p className="mb-5 max-w-2xl text-sm text-zinc-500">
          Full end-to-end designs that combine multiple fundamentals into one coherent architecture.
        </p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {caseStudies.map((topic) => (
            <SystemDesignCard key={topic.id} topic={topic} />
          ))}
        </div>
      </section>
    </div>
  );
}
