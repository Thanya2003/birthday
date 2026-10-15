// Page 3: Scratch card (rub the cover away to reveal a photo and message)
import gsap from 'gsap';
import Page from '../Page.jsx';
import { CONFIG } from '../config.js';
import { $, rand, pic, sfx, conf, showNext } from '../lib.js';

const setup = (root, c) => {
  root.innerHTML = `<h2 class="script">Scratch and reveal</h2>
    <p class="lead" id="sc-l">Rub the card with your finger</p>
    <div id="sc"><div class="sc-under">${pic(25)}<p>${CONFIG.SCRATCH_MESSAGE}</p></div><canvas></canvas></div>`;
  const box = $('#sc', root), cv = $('canvas', root), g = cv.getContext('2d', { willReadFrequently: true });
  const W = cv.width = box.clientWidth, H = cv.height = box.clientHeight;
  const gr = g.createLinearGradient(0, 0, W, H);
  gr.addColorStop(0, '#FFFAF0'); gr.addColorStop(.5, '#EAD3A2'); gr.addColorStop(1, '#D9B978');
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
  g.fillStyle = 'rgba(255,255,255,.55)';
  for (let i = 0; i < 90; i++) { g.beginPath(); g.arc(rand(0, W), rand(0, H), rand(.6, 2.2), 0, 6.283); g.fill(); }
  g.fillStyle = '#5a3d1e'; g.textAlign = 'center';
  g.font = '600 22px Poppins, Arial, sans-serif'; g.fillText('✦ Scratch me ✦', W / 2, H / 2);
  g.font = '13px Poppins, Arial, sans-serif'; g.fillText('something is hiding here', W / 2, H / 2 + 26);
  gsap.from(box, { scale: .7, rotation: -6, duration: .8, delay: .3, ease: 'back.out(1.5)' });

  let last = null, done = false, lastCheck = 0;
  const pos = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) * W / r.width, (e.clientY - r.top) * H / r.height]; };
  function check() {
    const d = g.getImageData(0, 0, W, H).data; let clear = 0, total = 0;
    for (let i = 3; i < d.length; i += 4 * 16) { total++; if (d[i] === 0) clear++; }
    if (clear / total > .5) reveal();
  }
  function reveal() {
    done = true; sfx.ding();
    gsap.to(cv, { opacity: 0, duration: .6, onComplete: () => cv.remove() });
    conf({ particleCount: 150, spread: 100, origin: { y: .5 } });
    $('#sc-l', root).textContent = 'There you are!';
    c.later(showNext, 700);
  }
  c.on(cv, 'pointerdown', e => { if (!done) last = pos(e); });
  c.on(cv, 'pointermove', e => {
    if (!last || done) return;
    const p = pos(e);
    g.globalCompositeOperation = 'destination-out';
    g.lineWidth = 46; g.lineCap = 'round'; g.lineJoin = 'round';
    g.beginPath(); g.moveTo(last[0], last[1]); g.lineTo(p[0], p[1]); g.stroke();
    last = p;
    const now = performance.now();
    if (now - lastCheck > 250) { lastCheck = now; check(); }
  });
  const up = () => { if (last && !done) check(); last = null; };
  c.on(window, 'pointerup', up); c.on(window, 'pointercancel', up);
};

export default function Scratch() {
  return <Page n={3} setup={setup} />;
}
