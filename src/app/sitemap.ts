// app/sitemap.ts

import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.askifyai.tech';

  // Get current date in YYYY-MM-DD format
  const lastModified = new Date().toISOString().split('T')[0];

  // List of all tool pages
  const toolPages = [
    '/cv-analyzer',
    '/interview-question',
    '/problem-solving',
    '/topic-review',
    '/interview-tips',
    '/behavioral-analysis',
    '/cover-letter-generator',
    '/skill-gap-analyzer',
    '/company-insights',
    '/job-search-strategist',
    '/salary-negotiator',
    '/career-planner',
  ];

  const toolUrls = toolPages.map((page) => ({
    url: `${baseUrl}${page}`,
    lastModified: lastModified,
    changeFrequency: 'monthly' as const, // Tools are feature pages, updated less frequently
    priority: 0.8, // High priority as they are the core offering
  }));

  // List of static info pages
  const staticPages = [
    {
      url: `${baseUrl}/`, // Homepage
      lastModified: lastModified,
      changeFrequency: 'weekly' as const, // Homepage may be updated more often
      priority: 1.0, // Highest priority
    },
    {
      url: `${baseUrl}/about`,
      lastModified: lastModified,
      changeFrequency: 'yearly' as const, // About Us page rarely changes
      priority: 0.5,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: lastModified,
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: lastModified,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: lastModified,
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ];

  return [...staticPages, ...toolUrls];
}