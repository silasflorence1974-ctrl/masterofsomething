// Article hero/card images. Shared between the homepage (card thumbnails) and
// ArticleLayout (og:image / twitter:image) so there is one map, not two.
// Only 5 of 16 articles have a dedicated image right now - the rest fall back
// to DEFAULT_IMAGE. Keyed by article id without the .md extension.
export const ARTICLE_IMAGES: Record<string, string> = {
  'build-your-ai-part-1':   '/images/article1_hardware.png',
  'anthropic-two-tier-ai':  '/images/article2_hero.png',
  'ai-lied-to-my-face':     '/images/article3_hero.png',
  'my-side-anthropic':      '/images/article2_twotier.png',
  'my-side-ava':            '/images/article3_pipeline.png',
};

export const DEFAULT_IMAGE = '/images/hero_workstation.png';

export function imageForSlug(slug: string): string {
  return ARTICLE_IMAGES[slug] ?? DEFAULT_IMAGE;
}
