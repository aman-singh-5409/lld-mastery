import type { ArchStep } from '@/data/systemDesign';

interface ArchFlowProps {
  steps: ArchStep[];
}

export default function ArchFlow({ steps }: ArchFlowProps) {
  return (
    <ol className="relative space-y-6 border-l border-zinc-800 pl-6">
      {steps.map((step, i) => (
        <li key={step.title} className="relative">
          <span className="absolute -left-[31px] flex h-6 w-6 items-center justify-center rounded-full border border-cyan-400/40 bg-zinc-950 text-xs font-semibold text-cyan-400">
            {i + 1}
          </span>
          <h4 className="text-sm font-semibold text-white">{step.title.replace(/^\d+\.\s*/, '')}</h4>
          <p className="mt-1 text-sm text-zinc-400 leading-relaxed">{step.detail}</p>
        </li>
      ))}
    </ol>
  );
}
