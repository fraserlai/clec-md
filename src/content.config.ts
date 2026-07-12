import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';
import { CATEGORY_IDS } from './config/categories.mjs';

// Shared frontmatter contract for every knowledge page (both languages).
// Adapted from taiwan-md's baseContentSchema, trimmed for CLEC.
const baseSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  category: z.enum(CATEGORY_IDS as [string, ...string[]]),
  subcategory: z.string().optional().default(''),
  tags: z.array(z.string()).default([]),
  author: z.string().optional().default('CLEC Contributors'),
  difficulty: z
    .enum(['beginner', 'intermediate', 'advanced'])
    .optional()
    .default('beginner'),
  featured: z.boolean().optional().default(false),
  status: z
    .enum(['draft', 'published', 'archived'])
    .optional()
    .default('published'),
  // Provenance: which raw/ sources this page was synthesized from
  // (e.g. "短篇/00421...", "X及YouTube的貼文/0022..."). Core to the LLM-Wiki model.
  sources: z.array(z.string()).optional().default([]),
  relatedTopics: z.array(z.string()).optional().default([]),
  lastVerified: z.coerce.date().optional(),
  lastHumanReview: z.boolean().optional().default(false),
});

const zhTW = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/zh-TW' }),
  schema: baseSchema.extend({
    alternativeNames: z.array(z.string()).optional().default([]),
  }),
});

const en = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/en' }),
  schema: baseSchema.extend({
    chineseTitle: z.string().optional(),
    translationStatus: z
      .enum(['complete', 'partial', 'planned'])
      .optional()
      .default('complete'),
  }),
});

export const collections = { 'zh-TW': zhTW, en };
