import { getCollection } from 'astro:content';

export async function GET() {
  const items = await getCollection('news', ({ data }) => !data.draft);

  const payload = items.map(item => ({
    slug: item.id.replace(/\.md$/, ''),
    title: item.data.title,
    description: item.data.description,
    publishDate: item.data.publishDate,
    newsDate: item.data.newsDate,
    author: item.data.author,
    readTime: item.data.readTime,
    tags: item.data.tags,
    sources: item.data.sources ?? [],
    breaking: item.data.breaking,
    url: `/news/${item.id.replace(/\.md$/, '')}`,
  }));

  return new Response(
    JSON.stringify({
      site: 'masterofsomething.com',
      publisher: 'In Practice Media',
      description: 'Original AI news reporting. Human and AI co-authored.',
      items: payload,
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
