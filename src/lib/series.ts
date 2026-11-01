// THE ONE LIST of series. Learn, the homepage tracks, article headers, cards and the series nav all read
// this, so a series name is never shown as its raw slug ("the-wider-stuff") again (found 2026-11-01).
export interface SeriesInfo {
  name: string;
  blurb: string;
  order: number;
  image: string;
}

export const SERIES: Record<string, SeriesInfo> = {
  'build-your-ai': {
    name: 'Build Your AI',
    blurb: 'Local AI from scratch, on your own hardware. Hardware, interface, memory - in order.',
    order: 1,
    image: '/images/hero_workstation.png',
  },
  'building-in-practice': {
    name: 'Building in Practice',
    blurb: 'What actually happens running an AI system day to day - the failures, the fixes, and the habits that came out of them.',
    order: 2,
    image: '/images/article9_bugworked.png',
  },
  'things-we-made': {
    name: 'Things We Made',
    blurb: 'Real objects, designed with AI and built by hand - with the measurements, the mistakes and the photos.',
    order: 3,
    image: '/images/staff/staff-glow.jpg',
  },
  'the-wider-stuff': {
    name: 'The Wider Stuff',
    blurb: 'AI as an industry, beyond this one system - Anthropic, the two-tier problem, what "ambient AI" really requires.',
    order: 4,
    image: '/images/article2_hero.png',
  },
};

export function seriesSlug(series: string): string {
  return series.toLowerCase().replace(/\s+/g, '-');
}

export function seriesName(series: string): string {
  return SERIES[seriesSlug(series)]?.name ?? series;
}
