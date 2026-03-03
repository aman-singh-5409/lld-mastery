import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'LLD Mastery - Master Low Level Design',
    template: '%s | LLD Mastery',
  },
  description:
    'Master Low Level Design with 24+ system design problems, 22 design patterns, and comprehensive OOP concepts with code examples in Python, Java, C++, C#, Go, and TypeScript.',
  keywords: ['LLD', 'Low Level Design', 'System Design', 'Design Patterns', 'OOP', 'Interview Prep'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-zinc-950 text-zinc-50 antialiased`}
      >
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
      </body>
    </html>
  );
}
