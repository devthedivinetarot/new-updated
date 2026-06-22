import type { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://thedivinetarotonline.com';

// Generative Engine Optimization (GEO): explicitly welcome the crawlers used by
// AI answer engines (ChatGPT, Perplexity, Gemini/Google AI Overviews, Claude,
// Bing Copilot, etc.) so the brand can be cited in AI-generated answers.
const AI_AND_SEARCH_BOTS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'PerplexityBot',
  'Perplexity-User',
  'Google-Extended',
  'Applebot-Extended',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'CCBot',
  'Amazonbot',
  'Bingbot',
  'DuckDuckBot',
  'Meta-ExternalAgent',
  'cohere-ai',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/'],
      },
      {
        userAgent: AI_AND_SEARCH_BOTS,
        allow: '/',
        disallow: ['/admin', '/api/'],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
