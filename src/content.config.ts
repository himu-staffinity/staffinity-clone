import { defineCollection } from "astro:content";
import { z } from 'astro/zod';
import { glob } from "astro/loaders";

const authors = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/authors" }),
  schema: z.object({
    name: z.string(),
    job: z.string(),
    description: z.string(),
    avatar: z.string(),
    linkedin: z.string().optional(),
  }),
});

const solutions = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/solutions" }),
  schema: z.object({
    title: z.string(),
    subtitle: z.array(z.string()),
    icon: z.string(),
    summary: z.string().optional(),
    primary_question: z.string().optional(),
    primary_answer: z.string().optional(),
    details: z.array(
      z.object({
        question: z.string(),
        answer: z.array(z.object({
          name: z.string(),
          description: z.string(),
        })),
      })
    ).optional(),
    layout: z.string().optional(),
    permalink: z.string().optional(),
  }),
});

const stories = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/stories" }),
  schema: z.object({
    title: z.string(),
  }),
});

export const collections = {
  authors,
  solutions,
  stories,
};
