import type { APIRoute } from 'astro';
import { getNews, newsUrl, newsDate, displayNewsDate } from '../../lib/news';

export const GET: APIRoute = async () => {
  const latest = (await getNews())[0]?.data;
  return new Response(JSON.stringify(latest ? {
    slug: latest.slug,
    title: latest.short_title || latest.title,
    url: newsUrl(latest.slug),
    date: newsDate(latest.date),
    displayDate: displayNewsDate(latest.date),
    image: latest.featured_image,
    imageAlt: latest.featured_image_alt || '',
  } : null), { headers: { 'Content-Type': 'application/json; charset=utf-8' } });
};
