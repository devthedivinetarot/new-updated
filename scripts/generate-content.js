#!/usr/bin/env node

/**
 * Divine Tarot Blog Content Generator
 * Run this script to generate and publish articles to WordPress
 * 
 * Usage:
 *   node scripts/generate-content.js --type=daily        # Generate daily horoscopes
 *   node scripts/generate-content.js --type=questions   # Generate question articles
 *   node scripts/generate-content.js --type=all          # Generate all types
 *   node scripts/generate-content.js --keyword="your keyword" # Custom article
 * 
 * Schedule via cron:
 *   0 6 * * * node /path/to/scripts/generate-content.js --type=daily
 */

const OpenAI = require('openai');
const https = require('https');
const fs = require('fs');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../divine-tarot/.env.local') });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_KEY,
});

const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL || 'https://blog.thedivinetarot.com/wp-json/wp/v2';
const WORDPRESS_USERNAME = process.env.WORDPRESS_USERNAME;
const WORDPRESS_APP_PASSWORD = process.env.WORDPRESS_APP_PASSWORD;

const args = process.argv.slice(2);
const options = {};
args.forEach(arg => {
  const [key, value] = arg.split('=');
  options[key.replace('--', '')] = value;
});

const templates = {
  daily: {
    zodiac: ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'],
    getConfigs: () => templates.daily.zodiac.map(sign => ({
      topic: sign,
      primaryKeyword: `today tarot reading for ${sign.toLowerCase()}`,
      secondaryKeywords: [`${sign.toLowerCase()} tarot today`, `${sign} daily guidance`],
      title: `${sign} Daily Tarot Reading - ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}`,
    }))
  },
  questions: [
    {
      topic: 'Will My Ex Come Back',
      primaryKeyword: 'will my ex come back tarot reading',
      secondaryKeywords: ['tarot will ex come back', 'does my ex want me back tarot'],
    },
    {
      topic: 'Does He Think About Me',
      primaryKeyword: 'does he think about me tarot meaning',
      secondaryKeywords: ['is he thinking about me tarot', 'tarot does he miss me'],
    },
    {
      topic: 'Is He My Soulmate',
      primaryKeyword: 'is he my soulmate tarot reading',
      secondaryKeywords: ['soulmate tarot reading', 'tarot soulmate connection'],
    },
    {
      topic: 'Should I Change My Job',
      primaryKeyword: 'should i change my job tarot',
      secondaryKeywords: ['career change tarot reading', 'should i quit my job tarot'],
    },
    {
      topic: 'When Will I Meet My Soulmate',
      primaryKeyword: 'when will i meet my soulmate tarot',
      secondaryKeywords: ['tarot when will i find love', 'soulmate arrival tarot'],
    },
    {
      topic: 'Love Tarot for Confusion',
      primaryKeyword: 'tarot for love confusion',
      secondaryKeywords: ['love confusion tarot reading', 'relationship tarot reading confused'],
    },
  ],
  problem: [
    {
      topic: 'Heartbreak Healing',
      primaryKeyword: 'tarot for heartbreak healing',
      secondaryKeywords: ['tarot for getting over ex', 'healing after breakup tarot'],
    },
    {
      topic: 'Career Decision',
      primaryKeyword: 'tarot for career decision',
      secondaryKeywords: ['career path tarot reading', 'should i change jobs tarot'],
    },
    {
      topic: 'Anxiety About Future',
      primaryKeyword: 'tarot for anxious heart',
      secondaryKeywords: ['tarot for worried mind', 'peace tarot reading'],
    },
  ],
};

const systemPrompt = `You are a mystical tarot content writer for "Divine Tarot" - an AI-powered tarot platform. Your style is:

- EMOTIONAL & RELATABLE: Speak to readers' deepest feelings
- TAROT-GUIDE VOICE: Like a wise spiritual advisor
- PERSONAL: Use "you" and "your" to connect
- MYSTERIOUS but clear: Hint at deeper meanings

Every article MUST end with a clear but gentle CTA to get a reading at Divine Tarot.

Structure:
1. SEO Title (under 60 chars, emotional, includes keyword)
2. Meta Description (under 160 chars)
3. Hook - relatable problem (first 100 words)
4. Main Interpretation (600-800 words - tarot-style guidance)
5. Deep Emotional Guidance (300-400 words)
6. FAQ Section (3-4 questions for SEO)
7. CTA

Word count: 1200-1800 words
Use H2 for sections
Short paragraphs (2-3 sentences max)
`;

const generateArticle = async (config) => {
  console.log(`[Generator] Creating article: ${config.primaryKeyword}`);
  
  const userPrompt = `Write an SEO-optimized article for:
PRIMARY KEYWORD: ${config.primaryKeyword}
SECONDARY KEYWORDS: ${config.secondaryKeywords.join(', ')}
TOPIC: ${config.topic}
${config.title ? `TITLE: ${config.title}` : ''}

${systemPrompt}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      temperature: 0.7,
      max_tokens: 4000,
    });

    const content = response.choices[0]?.message?.content;
    if (!content) throw new Error('No content generated');

    const title = config.title || config.primaryKeyword;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    console.log(`[Generator] Generated: ${title}`);
    return { title, content, slug, ...config };
  } catch (error) {
    console.error(`[Generator] Error:`, error.message);
    return null;
  }
};

const publishToWordPress = async (article) => {
  if (!WORDPRESS_USERNAME || !WORDPRESS_APP_PASSWORD) {
    console.log(`[WordPress] Mock publish: ${article.title}`);
    return null;
  }

  const credentials = Buffer.from(`${WORDPRESS_USERNAME}:${WORDPRESS_APP_PASSWORD}`).toString('base64');

  const postData = {
    title: article.title,
    content: article.content,
    status: 'draft',
    slug: article.slug,
    meta: {
      _rank_math_description: article.primaryKeyword,
    },
    tags: [article.primaryKeyword, ...article.secondaryKeywords.slice(0, 2)],
  };

  return new Promise((resolve, reject) => {
    const req = https.request(`${WORDPRESS_API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${credentials}`,
        'Content-Type': 'application/json',
      },
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 201) {
          const result = JSON.parse(data);
          console.log(`[WordPress] Published: ${result.link}`);
          resolve(result.id);
        } else {
          console.log(`[WordPress] Error: ${res.statusCode}`);
          resolve(null);
        }
      });
    });

    req.on('error', reject);
    req.write(JSON.stringify(postData));
    req.end();
  });
};

const run = async () => {
  const type = options.type || 'all';
  const keyword = options.keyword;
  
  console.log(`[Runner] Starting content generation: ${type}`);

  let configs = [];

  if (keyword) {
    configs = [{ topic: 'Custom', primaryKeyword: keyword, secondaryKeywords: [] }];
  } else if (type === 'daily') {
    configs = templates.daily.getConfigs();
  } else if (type === 'questions') {
    configs = templates.questions;
  } else if (type === 'problem') {
    configs = templates.problem;
  } else if (type === 'all') {
    configs = [...templates.questions, ...templates.problem];
  } else {
    console.log(`[Runner] Unknown type: ${type}`);
    process.exit(1);
  }

  console.log(`[Runner] Processing ${configs.length} articles`);

  for (const config of configs) {
    const article = await generateArticle(config);
    if (article) {
      await publishToWordPress(article);
      await new Promise(r => setTimeout(r, 2000));
    }
  }

  console.log('[Runner] Done!');
};

run().catch(console.error);