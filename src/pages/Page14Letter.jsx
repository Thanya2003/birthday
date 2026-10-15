// Page 14: The Letter
import gsap from 'gsap';
import Page from '../Page.jsx';
import { CONFIG } from '../config.js';
import { $, el, clamp, sfx, MUSIC_VOL, musicVol, showNext } from '../lib.js';

const setup = (root, c) => {
  root.innerHTML = `<p class="lead" id="lt-l">Press and hold the seal to open</p>
    <div id="env"><div class="env-body"></div><div class="env-flap"></div>
      <button id="seal" style="--p:0" aria-label="Hold to open"><span>${CONFIG.HIS_NAME[0] || '♥'}</span></button></div>
    <div id="letter"></div>`;
  const seal = $('#seal', root), letter = $('#letter', root);
  let hold = false, p = 0, opened = false;
  c.on(seal, 'pointerdown', e => { e.preventDefault(); hold = true; });
  c.on(window, 'pointerup', () => { hold = false; }); c.on(window, 'pointercancel', () => { hold = false; });
  c.on(seal, 'contextmenu', e => e.preventDefault());
  c.loop(dt => {
    if (opened) return;
    p = clamp(p + (hold ? dt * 50 : -dt * 80), 0, 100);
    seal.style.setProperty('--p', p);
    if (p >= 100) open();
  });
  function open() {
    opened = true; sfx.click(); musicVol(MUSIC_VOL * .6);
    $('#lt-l', root).innerHTML = '&nbsp;';
    gsap.to(seal, { scale: 1.5, opacity: 0, duration: .4 });
    gsap.to($('.env-flap', root), { rotationX: 180, duration: .7, delay: .3, ease: 'power2.inOut' });
    gsap.to($('#env', root), { y: 120, scale: .7, opacity: 0, duration: .7, delay: 1.1 });
    c.later(() => {
      // lay out every line first (still invisible) and shrink the writing until the whole letter fits, so it never scrolls
      const lines = CONFIG.LETTER.map(line => { const p = el('p'); p.textContent = line; letter.append(p); return p; });
      letter.style.display = 'block';
      let size = parseFloat(getComputedStyle(letter).fontSize);
      while (letter.scrollHeight > letter.clientHeight && size > 13) { size -= .5; letter.style.fontSize = size + 'px'; }
      gsap.fromTo(letter, { xPercent: -50, yPercent: -50, scale: .3, y: 80, opacity: 0 }, { scale: 1, y: 0, opacity: 1, duration: .8, ease: 'power2.out' });
      let t = 900;
      lines.forEach(p => {
        c.later(() => p.classList.add('in'), t);
        t += Math.max(1100, p.textContent.length * 55);
      });
      c.later(showNext, t + 600);
    }, 1500);
  }
  c.cleanup(() => musicVol(MUSIC_VOL));
};

export default function Letter() {
  return <Page n={14} setup={setup} />;
}
