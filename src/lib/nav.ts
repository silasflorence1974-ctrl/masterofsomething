export interface NavLink {
  href: string;
  label: string;
}

// THE ONE LIST. Header and Footer both import this rather than keeping their
// own copies -- that's exactly how they drifted apart before (header had five
// links, footer had three, and neither noticed). One source, two renderers.
export const navLinks: NavLink[] = [
  { href: '/learn/', label: 'Learn' },
  { href: '/news/', label: 'News' },
  { href: '/skywatch', label: 'Skywatch' },
  { href: '/silas/', label: "Silas's Corner" },
  { href: '/tools', label: 'Tools' },
  { href: '/about', label: 'About' },
];
