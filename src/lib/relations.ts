import { patterns } from '@/data/patterns';
import { problems, Problem } from '@/data/problems';

/**
 * Converts a pattern name from problems data to its slug in patterns data.
 * e.g. 'Chain of Responsibility' → 'chain-of-responsibility'
 *      'Factory' → 'factory'  (maps to Factory Method)
 * Returns null if no matching pattern exists.
 */
export function getPatternSlug(patternName: string): string | null {
  const derivedSlug = patternName.toLowerCase().replace(/\s+/g, '-');
  const found = patterns.find((p) => p.slug === derivedSlug);
  return found?.slug ?? null;
}

/**
 * Returns all problems that use a given pattern (matched by pattern slug).
 */
export function getProblemsForPattern(patternSlug: string): Problem[] {
  return problems.filter((problem) =>
    problem.patterns.some((name) => {
      const derivedSlug = name.toLowerCase().replace(/\s+/g, '-');
      return derivedSlug === patternSlug;
    })
  );
}
