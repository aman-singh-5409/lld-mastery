import { MetadataRoute } from 'next';
import { problems } from '@/data/problems';
import { patterns } from '@/data/patterns';
import { oopConcepts } from '@/data/oop';
import { systemDesignTopics } from '@/data/systemDesign';
import { siteConfig } from '@/lib/site-config';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${base}/system-design`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/problems`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/patterns`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/oop`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
  ];

  const systemDesignRoutes: MetadataRoute.Sitemap = systemDesignTopics.map((t) => ({
    url: `${base}/system-design/${t.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const problemRoutes: MetadataRoute.Sitemap = problems.map((p) => ({
    url: `${base}/problems/${p.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const patternRoutes: MetadataRoute.Sitemap = patterns.map((p) => ({
    url: `${base}/patterns/${p.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const oopRoutes: MetadataRoute.Sitemap = oopConcepts.map((c) => ({
    url: `${base}/oop/${c.slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticRoutes, ...systemDesignRoutes, ...problemRoutes, ...patternRoutes, ...oopRoutes];
}
