import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'zod';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/projects' }),
  schema: z.object({
    /** 项目标题 */
    title: z.string(),
    slug: z.string(),
    /** 副标题 */
    subtitle: z.string().optional(),
    /** 发布日期 */
    publishDate: z.date(),
    /** 封面图 URL */
    coverUrl: z.string(),
    /** 标签 */
    tags: z.array(z.string()),
    /** 作品概述 */
    summary: z.string(),
    /** CMF 或技术参数的键值对 */
    specs: z.record(z.string(), z.string()).optional(),
    /** 主题风格，用于差异化排版 */
    theme: z
      .enum(['dark-tech', 'warm-craft', 'minimalist'])
      .default('minimalist'),
  }),
});

const themes = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/themes' }),
  schema: z.object({
    title: z.string(),
    slug: z.string(),
    tagline: z.string(),
  }),
});

export const collections = { themes };
