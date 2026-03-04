import type { Metadata } from 'next';
import { siteConfig } from '@/lib/site-config';

const title = 'LLD Problems — Low Level Design Practice';
const description =
  'Practice Low Level Design with real-world problems like Parking Lot, Vending Machine, LRU Cache, and more. Step-by-step solutions with UML diagrams and code in Python, Java, C++, and TypeScript.';

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    'LLD Problems',
    'Low Level Design Problems',
    'Parking Lot Design',
    'Vending Machine Design',
    'LRU Cache Implementation',
    'System Design Practice',
    'Coding Interview Problems',
    'Object Oriented Design',
  ],
  alternates: {
    canonical: `${siteConfig.url}/problems`,
  },
  openGraph: {
    title,
    description,
    url: `${siteConfig.url}/problems`,
    siteName: siteConfig.name,
    images: [
      {
        url: `/api/og?title=${encodeURIComponent('LLD Problems')}&subtitle=${encodeURIComponent(description)}&type=problem`,
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
    images: [
      `/api/og?title=${encodeURIComponent('LLD Problems')}&subtitle=${encodeURIComponent(description)}&type=problem`,
    ],
  },
};

export default function ProblemsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
