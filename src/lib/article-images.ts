// Article/news hero images. Shared between the homepage (card thumbnails) and
// ArticleLayout/NewsLayout (og:image / twitter:image) so there is one map, not
// several. Keyed by content id without the .md extension.
//
// Matched by actually viewing each candidate image against its piece, not by
// filename alone (2026-09-21). The numbered sets are per-article image
// batches from an earlier generation pass, most of which sat unused - this
// map pulls the real matches out of that pool instead of falling back to one
// repeated default image on every unmapped page.
export const ARTICLE_IMAGES: Record<string, string> = {
  // articles
  'build-your-ai-part-1':            '/images/article1_hardware.png',
  'build-your-ai-part-2':            '/images/article4_dashboard.png',   // chat/WebUI interface on a monitor
  'build-your-ai-part-3':            '/images/article7_memory.png',      // layered glowing written records
  'anthropic-two-tier-ai':           '/images/article2_hero.png',
  'ai-lied-to-my-face':              '/images/article3_hero.png',
  'my-side-anthropic':               '/images/article2_twotier.png',
  'my-side-ava':                     '/images/article3_pipeline.png',
  'the-real-cost-of-free-ai':        '/images/article5_data.png',        // data flowing from a person into a vault
  'what-ambient-ai-actually-requires': '/images/article6_ambient.png',   // smart home at night, devices lit
  'anthropic-vs-pentagon':           '/images/article_pentagon_hero.png', // courthouse with server towers behind it
  'the-honest-archive':              '/images/article3_discovery.png',   // a screen in the dark, a file marked REAL
  'why-i-dont-trust-done':           '/images/article1_checklist.png',   // a sequence of checkmarks building to one
  'built-to-refuse':                 '/images/article8_refuse.png',      // a single door, shut, glowing amber
  'the-bug-that-says-it-worked':     '/images/article9_bugworked.png',   // a monitor, a highlighted region in a data grid
  'the-machine-that-relived-its-week': '/images/article7_continuity.png', // a thread of light connecting two sessions
  'walls-you-cant-move':             '/images/article11_walls.png',      // a long concrete corridor, no way through

  // news (some share a slug with, and therefore an image with, their article)
  'ai-regulation-map-2026':          '/images/article_regulation_hero.png', // lit US states map
  'anthropic-two-tier':              '/images/article2_hero.png',
};

export const DEFAULT_IMAGE = '/images/hero_workstation.png';

export function imageForSlug(slug: string): string {
  return ARTICLE_IMAGES[slug] ?? DEFAULT_IMAGE;
}
