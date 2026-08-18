import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    series: z.string(),
    seriesOrder: z.number(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('David Florence and Silas'),
    readTime: z.string(),
    tags: z.array(z.string()),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    // Guide schema v2 — all optional, existing articles unaffected.
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
    timeRequired: z.string().optional(),
    cost: z.string().optional(),
    testedOn: z.string().optional(),
    lastTested: z.coerce.date().optional(),
    untested: z.boolean().default(false),
  }),
});

const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('David Florence and Silas'),
    readTime: z.string(),
    tags: z.array(z.string()),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
    newsDate: z.coerce.date().optional(),
    sources: z.array(z.string()).optional(),
    breaking: z.boolean().default(false),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
  }),
});

const shed = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/shed' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    author: z.string().default('David Florence and Silas'),
    readTime: z.string(),
    tags: z.array(z.string()),
    draft: z.boolean().default(false),
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
  }),
});

export const collections = { articles, news, shed };
