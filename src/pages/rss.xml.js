import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const articles = await getCollection('articles', ({ data }) => !data.draft);
  return rss({
    title: 'masterofsomething.com',
    description: 'In Practice Media — technical tutorials by practitioners. Human and AI co-authored.',
    site: context.site,
    items: articles
      .sort((a, b) => b.data.publishDate.getTime() - a.data.publishDate.getTime())
      .map(article => ({
        title: article.data.title,
        description: article.data.description,
        pubDate: article.data.publishDate,
        author: article.data.author,
        link: `/learn/${article.data.series.toLowerCase().replace(/\s+/g, '-')}/${article.id.replace(/\.md$/, '')}`,
        categories: article.data.tags,
      })),
    customData: '<language>en-us</language>',
  });
}
