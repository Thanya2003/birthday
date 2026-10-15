// Page 2: About the birthday boy (profile, numbers, flip cards)
import gsap from 'gsap';
import Page from '../Page.jsx';
import { CONFIG } from '../config.js';
import { $, $$, pic, sfx, showNext } from '../lib.js';

const setup = (root, c) => {
  const b = new Date(CONFIG.BIRTH_DATE), ok = !isNaN(b), now = new Date();
  let age = ok ? now.getFullYear() - b.getFullYear() : 0;
  if (ok && (now.getMonth() < b.getMonth() || (now.getMonth() === b.getMonth() && now.getDate() < b.getDate()))) age--;
  const days = ok ? Math.floor((now - b) / 864e5) : 0;
  const cards = CONFIG.ABOUT_CARDS.slice(0, 3);
  root.innerHTML = `<h2 class="script">About the birthday boy</h2>
    <div class="ab-card glass"><div class="ab-ph">${pic(24)}</div>
      <div><h3>${CONFIG.HIS_NAME}</h3><p class="ab-tags">${CONFIG.ABOUT_TAGS.map(t => `<span>${t}</span>`).join('')}</p></div></div>
    <div class="ab-stats">
      <div class="stat glass"><b data-to="${age}">0</b><span>years young</span></div>
      <div class="stat glass"><b data-to="${days}">0</b><span>days of awesome</span></div>
      <div class="stat glass"><b>${CONFIG.ABOUT_STAT.value}</b><span>${CONFIG.ABOUT_STAT.label}</span></div>
    </div>
    <p class="lead" id="ab-l">Tap each card to flip it</p>
    <div class="ab-flip">${cards.map(k => `<div class="fc"><div class="fc-in">
      <div class="fc-f"><i>${k.icon}</i>${k.title}</div><div class="fc-b">${k.text}</div></div></div>`).join('')}</div>`;
  gsap.from(root.children, { y: 30, opacity: 0, duration: .7, stagger: .15, delay: .3, ease: 'power3.out' });
  $$('.stat b[data-to]', root).forEach(e => {
    const o = { v: 0 }, to = +e.dataset.to;
    gsap.to(o, { v: to, duration: 1.8, delay: .9, ease: 'power2.out', onUpdate: () => { e.textContent = Math.round(o.v).toLocaleString(); } });
  });
  let flipped = 0;
  $$('.fc', root).forEach(f => f.onclick = () => {
    if (f.classList.contains('flip')) return;
    f.classList.add('flip'); sfx.tick();
    if (++flipped === cards.length) { $('#ab-l', root).textContent = 'And that is only the start...'; sfx.ding(); c.later(showNext, 600); }
  });
};

export default function About() {
  return <Page n={2} setup={setup} />;
}
