import Link from 'next/link';
import { Code2, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-500/10">
        <Code2 className="h-10 w-10 text-blue-400" />
      </div>
      <h1 className="mb-3 text-4xl font-bold text-white">404</h1>
      <h2 className="mb-4 text-xl font-semibold text-zinc-300">Page Not Found</h2>
      <p className="mb-8 max-w-md text-zinc-400">
        The page you are looking for does not exist. It may have been moved or deleted.
      </p>
      <Link
        href="/"
        className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-500"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>
    </div>
  );
}
