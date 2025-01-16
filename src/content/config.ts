import { defineCollection, z } from 'astro:content';

const articleCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.date(),
    author: z.object({
      name: z.string(),
      image: z.string(),
      role: z.string(),
    }),
    category: z.string(),
    image: z.string(),
    featured: z.boolean().optional().default(false),
    draft: z.boolean().optional().default(false),
  }),
});

export const collections = {
  articles: articleCollection,
};