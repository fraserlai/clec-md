// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import rehypeExternalLinks from 'rehype-external-links';
import remarkWikilinks from './plugins/remark-wikilinks.mjs';

// Update to the production URL when deploying.
// GitHub Pages (project site) serves at https://<user>.github.io/<repo>/,
// so we set `base` to the repo name. For a custom domain (clec.md) later,
// set SITE='https://clec.md' and BASE='/'.
const SITE = 'https://fraserlai.github.io';
const BASE = '/clec-md';

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'always',
  markdown: {
    remarkPlugins: [[remarkWikilinks, { base: BASE }]],
    rehypePlugins: [
      [
        rehypeExternalLinks,
        { target: '_blank', rel: ['noopener', 'noreferrer'] },
      ],
    ],
  },
  integrations: [sitemap()],
});
