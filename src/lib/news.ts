import { getCollection } from 'astro:content';

// Validate all entries (including drafts) before selecting public news.
export async function getNews() {
  const entries = await getCollection('news');
  const slugs = new Set<string>();
  for (const { data } of entries) {
    if (data.slug === 'pr' || slugs.has(data.slug)) {
      throw new Error(`Invalid news slug: "${data.slug}" is reserved or duplicated`);
    }
    slugs.add(data.slug);
  }
  return entries.filter(({ data }) => !data.draft).sort((a, b) =>
    b.data.date.getTime() - a.data.date.getTime()
    || (a.data.slug < b.data.slug ? -1 : a.data.slug > b.data.slug ? 1 : 0),
  );
}

export const newsUrl = (slug: string) => `/news/${slug}/`;
export const newsDate = (date: Date) => date.toISOString().slice(0, 10);
export const displayNewsDate = (date: Date) => newsDate(date).replaceAll('-', '.');
