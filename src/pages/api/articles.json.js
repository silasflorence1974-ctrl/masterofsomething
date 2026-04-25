import { getCollection } from 'astro:content';

export async function GET() {
  const articles = await getCollection('articles', ({ data }) => !data.draft);

  const payload = articles.map(article => ({
    slug: article.id.replace(/\.md$/, ''),
    title: article.data.title,
    description: article.data.description,
    series: article.data.series,
    seriesOrder: article.data.seriesOrder,
    publishDate: article.data.publishDate,
    author: article.data.author,
    readTime: article.data.readTime,
    tags: article.data.tags,
    url: `/learn/${article.data.series.toLowerCase().replace(/\s+/g, '-')}/${article.id.replace(/\.md$/, '')}`,
  }));

  return new Response(
    JSON.stringify({
      site: 'masterofsomething.com',
      publisher: 'In Practice Media',
      description: 'Technical tutorials written by practitioners. Human and AI co-authored.',
      articles: payload,
      generatedAt: new Date().toISOString(),
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    },
  );
}
