/**
 * Minimal [[wikilink]] support for markdown.
 *
 * Converts `[[Target]]` and `[[Target|Alias]]` in text into internal links.
 * Targets resolve to `/wiki/<slug>` where slug keeps CJK characters and turns
 * ASCII runs into kebab-case. A build-time redirect/alias map can later point
 * `/wiki/<slug>` at the canonical `/<category>/<slug>` page; until then these
 * links are stable, human-readable, and never crash the build.
 *
 * Kept in-repo (no external dependency) so it stays version-proof.
 */
import { visit } from 'unist-util-visit';

const WIKILINK = /\[\[([^\]|]+?)(?:\|([^\]]+?))?\]\]/g;

export function slugifyWikiTarget(name) {
  return name
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}\-_]/gu, '')
    .replace(/-+/g, '-')
    .toLowerCase();
}

export default function remarkWikilinks() {
  return (tree) => {
    visit(tree, 'text', (node, index, parent) => {
      if (!parent || index === null) return;
      const value = node.value;
      if (!value.includes('[[')) return;

      const children = [];
      let last = 0;
      let m;
      WIKILINK.lastIndex = 0;
      while ((m = WIKILINK.exec(value)) !== null) {
        const [full, target, alias] = m;
        if (m.index > last) {
          children.push({ type: 'text', value: value.slice(last, m.index) });
        }
        const label = (alias ?? target).trim();
        const slug = slugifyWikiTarget(target);
        children.push({
          type: 'link',
          url: `/wiki/${slug}`,
          data: { hProperties: { className: 'wikilink' } },
          children: [{ type: 'text', value: label }],
        });
        last = m.index + full.length;
      }
      if (children.length === 0) return;
      if (last < value.length) {
        children.push({ type: 'text', value: value.slice(last) });
      }
      parent.children.splice(index, 1, ...children);
      return index + children.length;
    });
  };
}
