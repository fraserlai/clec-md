#!/usr/bin/env node
/**
 * Build a single self-contained preview.html from knowledge/*.md.
 *
 * No server, no deploy: run `node scripts/preview.mjs` and open preview.html
 * directly in a browser (file://). It renders every zh-TW page (and its en
 * mirror when present) with a category sidebar, wikilinks, and footnotes.
 *
 * This is a throwaway preview — the real site is built by Astro (`npm run dev`).
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, dirname, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';
import { marked } from 'marked';

import { CATEGORIES, categoryName } from '../src/config/categories.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const KNOWLEDGE = join(ROOT, 'knowledge');
const OUT = join(ROOT, 'preview.html');

// ---- collect pages ---------------------------------------------------------

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (name.endsWith('.md')) out.push(p);
  }
  return out;
}

// zh-TW pages live in knowledge/<category>/*.md ; en mirrors in knowledge/en/...
const zhFiles = walk(KNOWLEDGE).filter((p) => !p.includes(`${join('knowledge', 'en')}`));

const pages = zhFiles.map((file) => {
  const slug = basename(file, '.md');
  const { data, content } = matter(readFileSync(file, 'utf8'));
  const enFile = file.replace(join('knowledge', ''), join('knowledge', 'en', ''));
  const en = existsSync(enFile) ? matter(readFileSync(enFile, 'utf8')) : null;
  return {
    slug,
    id: encodeURIComponent(slug),
    data,
    content,
    en: en ? { data: en.data, content: en.content } : null,
    category: data.category || 'about',
  };
});

const slugSet = new Set(pages.map((p) => p.slug));

// ---- markdown rendering (wikilinks + footnotes) ----------------------------

function esc(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

function renderMarkdown(md) {
  // Footnotes: pull definitions out, then linkify references.
  const defs = new Map();
  md = md.replace(/^\[\^([^\]]+)\]:\s*([\s\S]*?)(?=\n\[\^|\n{2,}|$)/gm, (_m, id, body) => {
    defs.set(id, body.trim());
    return '';
  });
  const order = [];
  md = md.replace(/\[\^([^\]]+)\]/g, (_m, id) => {
    if (!order.includes(id)) order.push(id);
    const n = order.indexOf(id) + 1;
    return `<sup class="fnref" id="fnref-${esc(id)}"><a href="#fn-${esc(id)}">[${n}]</a></sup>`;
  });

  // Wikilinks: [[target|label]] or [[target]] → internal link if page exists.
  md = md.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_m, target, label) => {
    const t = target.trim();
    const text = (label || target).trim();
    if (slugSet.has(t)) return `<a class="wl" href="#${encodeURIComponent(t)}" data-nav="${esc(t)}">${esc(text)}</a>`;
    return `<span class="wl wl-missing" title="尚無此頁：${esc(t)}">${esc(text)}</span>`;
  });

  let html = marked.parse(md, { gfm: true, breaks: false });

  if (order.length) {
    const items = order
      .map((id, i) => {
        const body = defs.get(id) ? marked.parseInline(defs.get(id)) : '';
        return `<li id="fn-${esc(id)}"><span class="fnnum">${i + 1}.</span> ${body} <a class="fnback" href="#fnref-${esc(id)}">↩</a></li>`;
      })
      .join('\n');
    html += `\n<section class="footnotes"><h3>註腳</h3><ol>${items}</ol></section>`;
  }
  return html;
}

// ---- build page HTML -------------------------------------------------------

const DIFF_LABEL = { beginner: '入門', intermediate: '進階', advanced: '高階' };

function pageSection(p) {
  const d = p.data;
  const tags = (d.tags || []).map((t) => `<span class="tag">${esc(t)}</span>`).join('');
  const related = (d.relatedTopics || [])
    .map((t) =>
      slugSet.has(t)
        ? `<a class="wl" href="#${encodeURIComponent(t)}" data-nav="${esc(t)}">${esc(t)}</a>`
        : `<span class="wl wl-missing">${esc(t)}</span>`
    )
    .join(' · ');
  const enBlock = p.en
    ? `<div class="lang-en" hidden><h1>${esc(p.en.data.title || d.title)}</h1>${renderMarkdown(p.en.content)}</div>`
    : '';
  return `
<article class="page" id="${p.id}" data-cat="${esc(p.category)}" hidden>
  <div class="crumbs">${esc(categoryName(p.category))} ${p.en ? '<button class="langtog" type="button">EN ⇄ 中</button>' : ''}</div>
  <div class="lang-zh">
    <h1>${esc(d.title || p.slug)}</h1>
    <p class="desc">${esc(d.description || '')}</p>
    <div class="meta">
      ${d.date ? `<span>📅 ${esc(d.date)}</span>` : ''}
      ${d.difficulty ? `<span>🎚️ ${esc(DIFF_LABEL[d.difficulty] || d.difficulty)}</span>` : ''}
      ${d.status ? `<span>· ${esc(d.status)}</span>` : ''}
      ${d.featured ? '<span class="feat">★ featured</span>' : ''}
    </div>
    <div class="tags">${tags}</div>
    ${renderMarkdown(p.content)}
    ${related ? `<div class="related"><strong>相關主題：</strong>${related}</div>` : ''}
  </div>
  ${enBlock}
</article>`;
}

// sidebar grouped by category order in config
const byCat = new Map(CATEGORIES.map((c) => [c.id, []]));
for (const p of pages) {
  if (!byCat.has(p.category)) byCat.set(p.category, []);
  byCat.get(p.category).push(p);
}

const nav = CATEGORIES.filter((c) => (byCat.get(c.id) || []).length)
  .map((c) => {
    const links = byCat
      .get(c.id)
      .map((p) => `<li><a href="#${p.id}" data-nav="${esc(p.slug)}">${esc(p.data.title || p.slug)}</a></li>`)
      .join('');
    return `<div class="navcat"><div class="navhead">${c.icon || ''} ${esc(categoryName(c.id))}</div><ul>${links}</ul></div>`;
  })
  .join('');

const sections = pages.map(pageSection).join('\n');

// ---- assemble document -----------------------------------------------------

const html = `<!doctype html>
<html lang="zh-TW">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>clec.md — 預覽</title>
<style>
:root{
  --bg:#faf9f6; --panel:#fff; --ink:#1c1b19; --muted:#6b6862; --line:#e7e4dd;
  --accent:#0b6b52; --accent-soft:#e6f2ee; --miss:#b23; --tag:#f0eee8;
}
@media (prefers-color-scheme:dark){
  :root{ --bg:#16161a; --panel:#1e1e24; --ink:#e9e8e4; --muted:#a09d95; --line:#33323a;
    --accent:#4fd0a6; --accent-soft:#173229; --tag:#2a2a31; }
}
*{box-sizing:border-box}
html,body{margin:0}
body{font:16px/1.75 -apple-system,"PingFang TC","Noto Sans TC",system-ui,sans-serif;
  color:var(--ink);background:var(--bg);}
a{color:var(--accent);text-decoration:none}
a:hover{text-decoration:underline}
.layout{display:grid;grid-template-columns:300px 1fr;min-height:100vh}
aside{position:sticky;top:0;align-self:start;height:100vh;overflow:auto;
  background:var(--panel);border-right:1px solid var(--line);padding:20px 16px}
.brand{font-weight:700;font-size:20px;margin:4px 8px 4px}
.brand small{display:block;font-weight:400;font-size:12px;color:var(--muted);margin-top:2px}
.navcat{margin-top:18px}
.navhead{font-size:12px;letter-spacing:.05em;color:var(--muted);text-transform:uppercase;padding:0 8px 4px}
aside ul{list-style:none;margin:0;padding:0}
aside li a{display:block;padding:5px 8px;border-radius:7px;color:var(--ink);font-size:14px}
aside li a:hover{background:var(--accent-soft);text-decoration:none}
aside li a.active{background:var(--accent);color:#fff}
main{padding:40px min(6vw,64px);max-width:900px}
.page h1{font-size:30px;line-height:1.3;margin:.2em 0 .3em}
.crumbs{color:var(--muted);font-size:13px;margin-bottom:8px;display:flex;gap:12px;align-items:center}
.langtog{font-size:12px;border:1px solid var(--line);background:var(--panel);color:var(--muted);
  border-radius:20px;padding:2px 10px;cursor:pointer}
.desc{color:var(--muted);font-size:15px;margin:.2em 0 1em}
.meta{display:flex;gap:12px;flex-wrap:wrap;font-size:13px;color:var(--muted);margin-bottom:8px}
.meta .feat{color:var(--accent)}
.tags{display:flex;gap:6px;flex-wrap:wrap;margin-bottom:22px}
.tag{background:var(--tag);color:var(--muted);font-size:12px;padding:2px 9px;border-radius:20px}
.page blockquote{border-left:3px solid var(--accent);background:var(--accent-soft);
  margin:1.2em 0;padding:.6em 1.1em;border-radius:0 8px 8px 0}
.page h2{font-size:22px;margin:1.6em 0 .4em;padding-top:.3em}
.page h3{font-size:18px;margin:1.3em 0 .3em}
.wl{border-bottom:1px dashed var(--accent)}
.wl-missing{color:var(--miss);border-bottom:1px dashed var(--miss);cursor:help}
.sup,.fnref{font-size:.7em}
.fnref a{padding:0 1px}
.footnotes{margin-top:2.5em;border-top:1px solid var(--line);font-size:14px;color:var(--muted)}
.footnotes ol{list-style:none;padding:0}
.footnotes li{margin:.5em 0}
.fnnum{color:var(--accent);font-weight:600;margin-right:4px}
.fnback{margin-left:4px}
.related{margin-top:2em;padding-top:1em;border-top:1px solid var(--line);font-size:14px}
.homecard{border:1px solid var(--line);border-radius:12px;padding:18px 20px;margin:14px 0;
  background:var(--panel);cursor:pointer}
.homecard:hover{border-color:var(--accent)}
.homecard h3{margin:0 0 4px;font-size:17px}
.homecard p{margin:0;color:var(--muted);font-size:14px}
code{background:var(--tag);padding:1px 5px;border-radius:4px;font-size:.9em}
@media(max-width:800px){.layout{grid-template-columns:1fr}aside{position:static;height:auto;border-right:none;border-bottom:1px solid var(--line)}}
</style>
</head>
<body>
<div class="layout">
<aside>
  <div class="brand">clec.md<small>CLEC 投資理財 · 本地預覽（未部署）</small></div>
  <div class="navcat"><ul><li><a href="#__home" data-nav="__home">🏠 首頁</a></li></ul></div>
  ${nav}
</aside>
<main>
  <article class="page" id="__home">
    <h1>clec.md 知識庫預覽</h1>
    <p class="desc">共 ${pages.length} 篇 · 直接開檔即可瀏覽，無需部署。點左側或下方卡片進入。</p>
    ${CATEGORIES.filter((c) => (byCat.get(c.id) || []).length)
      .map(
        (c) =>
          `<h2>${c.icon || ''} ${esc(categoryName(c.id))}</h2>` +
          byCat
            .get(c.id)
            .map(
              (p) =>
                `<div class="homecard" data-nav="${esc(p.slug)}"><h3>${esc(p.data.title || p.slug)}</h3><p>${esc(p.data.description || '')}</p></div>`
            )
            .join('')
      )
      .join('')}
  </article>
  ${sections}
</main>
</div>
<script>
const pages=document.querySelectorAll('.page');
const navlinks=document.querySelectorAll('[data-nav]');
function show(slug){
  const id = slug==='__home' ? '__home' : encodeURIComponent(slug);
  let found=false;
  pages.forEach(p=>{const on=p.id===id; p.hidden=!on; if(on)found=true;});
  if(!found){document.getElementById('__home').hidden=false;}
  document.querySelectorAll('aside a').forEach(a=>a.classList.toggle('active',a.getAttribute('data-nav')===slug));
  window.scrollTo(0,0);
}
document.addEventListener('click',e=>{
  const el=e.target.closest('[data-nav]');
  if(el){e.preventDefault();const s=el.getAttribute('data-nav');history.pushState(null,'','#'+(s==='__home'?'':encodeURIComponent(s)));show(s);return;}
  const tog=e.target.closest('.langtog');
  if(tog){const art=tog.closest('.page');art.querySelector('.lang-zh').hidden=!art.querySelector('.lang-zh').hidden;const en=art.querySelector('.lang-en');if(en)en.hidden=!en.hidden;}
});
window.addEventListener('popstate',()=>route());
function route(){const h=decodeURIComponent(location.hash.slice(1));show(h||'__home');}
route();
</script>
</body>
</html>`;

writeFileSync(OUT, html);
console.log(`✓ wrote ${OUT}  (${pages.length} pages)`);
