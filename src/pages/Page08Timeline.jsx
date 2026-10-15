// Page 8: Memory Lane Timeline
import Page from '../Page.jsx';
import { CONFIG } from '../config.js';
import { $, $$, rand, clamp, pic, sfx, type, showNext } from '../lib.js';

const setup = (root, c) => {
  root.innerHTML = `<div class="tl-head"><h2 class="script">Memory Lane</h2><p>Scroll down ↓</p></div>
    <div class="tl"><div class="tl-line"><i></i><span class="tl-heart">♥</span></div>
    ${CONFIG.MEMORIES.map((m, i) => `<div class="tl-item ${i % 2 ? 'R' : 'L'}"><span class="tl-dot"></span>
      <div class="pol" style="--r:${(i % 2 ? 1 : -1) * rand(3, 5)}deg"><div class="ph">${pic(8 + i)}</div><b></b><p></p></div></div>`).join('')}
    </div>
    <div class="tl-end"><h2 class="script">And this is just the beginning...</h2>
      <svg viewBox="0 0 100 60"><path d="M10,30 C10,10 35,10 50,30 C65,50 90,50 90,30 C90,10 65,10 50,30 C35,50 10,50 10,30 Z"/></svg></div>`;
  const tl = $('.tl', root), fill = $('.tl-line i', root), heart = $('.tl-heart', root), end = $('.tl-end', root), items = $$('.tl-item', root);
  function update() {
    const H = innerHeight, r = tl.getBoundingClientRect();
    const p = clamp((H * .6 - r.top) / r.height, 0, 1) * 100;
    fill.style.height = p + '%'; heart.style.top = p + '%';
    items.forEach((it, i) => {
      if (it.classList.contains('show') || it.getBoundingClientRect().top > H * .8) return;
      it.classList.add('show'); sfx.tick();
      const m = CONFIG.MEMORIES[i];
      c.later(() => type($('b', it), m.date, 40, c).then(() => type($('p', it), m.text, 30, c)), 600);
    });
    if (!end.classList.contains('show') && end.getBoundingClientRect().top < H * .85) { end.classList.add('show'); c.later(showNext, 800); }
  }
  c.on(root, 'scroll', update, { passive: true }); c.on(window, 'resize', update);
  c.later(update, 900);
};

export default function Timeline() {
  return <Page n={8} setup={setup} />;
}
