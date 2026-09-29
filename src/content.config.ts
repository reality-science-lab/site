import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// 記事コレクション。1記事 = src/content/articles/*.md 一枚。
// 新しい記事を追加するには、ここに .md を置いて frontmatter を埋めるだけ。
const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: z.object({
    title: z.string(),
    // 公開日。permalink の年月（/YYYY/MM/）はこの日付から導出する。
    date: z.coerce.date(),
    // WordPress の post_name。permalink は /<year>/<month>/<slug>/ になる。
    slug: z.string(),
    // カテゴリ slug（event / news / workshop / pr）。複数可。
    categories: z.array(z.string()).default([]),
    // 記事上部に出るシリーズ見出し（例: 現実科学レクチャーシリーズ）
    series_label: z.string().optional(),
    // アイキャッチ。/wp-content/uploads/... のローカルパス。
    featured_image: z.string().optional(),
    // 一覧・OGP 用の抜粋
    excerpt: z.string().optional(),
    // 移行元の WordPress 投稿 ID（トレーサビリティ用）
    wp_id: z.number().optional(),
    draft: z.boolean().default(false),
  }),
});

const news = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/news',
    // Preserve files with duplicate frontmatter slugs so getNews can reject them.
    generateId: ({ entry }) => entry,
  }),
  schema: z.object({
    title: z.string().min(1),
    short_title: z.string().optional(),
    date: z.coerce.date(),
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .refine((slug) => slug !== 'pr', 'news slug "pr" is reserved'),
    excerpt: z.string().min(1),
    featured_image: z.string().optional(),
    featured_image_alt: z.string().optional(),
    source_url: z.string().url().regex(/^https?:\/\//).optional(),
    source_label: z.string().default('PR TIMES'),
    draft: z.boolean().default(false),
  }),
});

export const collections = { articles, news };
