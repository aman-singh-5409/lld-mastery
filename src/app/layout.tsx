import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Providers from '@/components/Providers';
import { siteConfig } from '@/lib/site-config';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const viewport: Viewport = {
  themeColor: '#09090b',
  colorScheme: 'dark',
};

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: 'LLD Mastery — Master Low Level Design',
    template: '%s | LLD Mastery',
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.author }],
  creator: siteConfig.author,
  publisher: siteConfig.author,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: 'LLD Mastery — Master Low Level Design',
    description: siteConfig.description,
    images: [
      {
        url: `/api/og?title=${encodeURIComponent('LLD Mastery')}&subtitle=${encodeURIComponent('Master Low Level Design with interactive problems, design patterns, and OOP concepts')}&type=default`,
        width: 1200,
        height: 630,
        alt: 'LLD Mastery',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LLD Mastery — Master Low Level Design',
    description: siteConfig.description,
    creator: siteConfig.twitterHandle,
    site: siteConfig.twitterHandle,
    images: [
      `/api/og?title=${encodeURIComponent('LLD Mastery')}&subtitle=${encodeURIComponent('Master Low Level Design with interactive problems, design patterns, and OOP concepts')}&type=default`,
    ],
  },
  alternates: {
    canonical: siteConfig.url,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
  },
  category: 'education',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/problems?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-zinc-950 text-zinc-50 antialiased`}
      >
        <Providers>
          <Navbar />
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>
          <footer className="border-t border-zinc-800 py-8 text-center text-sm text-zinc-500">
            <div className="mx-auto max-w-7xl px-4">
              <p>
                Built for learning Low Level Design •{' '}
                <a
                  href="https://github.com/ashishps1/awesome-low-level-design"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300"
                >
                  Content from awesome-low-level-design
                </a>
              </p>
            </div>
          </footer>
        </Providers>
      </body>
    </html>
  );
}
