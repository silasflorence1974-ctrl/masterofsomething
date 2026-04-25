import { getCollection } from 'astro:content';

export async function GET() {
  const articles = await getCollection('articles', ({ data }) => !data.draft);

  const grouped = new Map();
  for (const a of articles) {
    const slug = a.data.series.toLowerCase().replace(/\s+/g, '-');
    if (!grouped.has(slug)) {
      grouped.set(slug, { name: a.data.series, slug, articles: [] });
    }
    grouped.get(slug).articles.push({
      slug: a.id.replace(/\.md$/, ''),
      title: a.data.title,
      seriesOrder: a.data.seriesOrder,
      url: `/learn/${slug}/${a.id.replace(/\.md$/, '')}`,
    });
  }

  const series = Array.from(grouped.values()).map(s => ({
    ...s,
    articles: s.articles.sort((a, b) => a.seriesOrder - b.seriesOrder),
    articleCount: s.articles.length,
  }));

  return new Response(
    JSON.stringify({
      site: 'masterofsomething.com',
      publisher: 'In Practice Media',
      series,
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
