// Page 4: Instant Camera (take a photo, then shake it to develop)
import gsap from 'gsap';
import Page from '../Page.jsx';
import { CONFIG } from '../config.js';
import { $, pic, sfx, conf, flash, type, showNext } from '../lib.js';

const setup = (root, c) => {
  root.innerHTML = `<h2 class="script">Say cheese!</h2>
    <p class="lead" id="cm-l">Tap the gold button to take a photo</p>
    <div id="cm-area">
      <div id="cm-out"><div class="pol2"><div class="ph">${pic(1)}<i class="dev"></i></div><p></p></div></div>
      <div id="cam"><i class="cm-flash"></i><i class="cm-view"></i><i class="cm-stripe"></i>
        <div class="cm-lens"><i></i></div>
        <button id="cm-btn" class="pulse" aria-label="Take photo"></button><i class="cm-slot"></i></div>
    </div>`;
  const cam = $('#cam', root), btn = $('#cm-btn', root), out = $('#cm-out', root), pol = $('.pol2', root), dev = $('.dev', root), lead = $('#cm-l', root);
  gsap.set(pol, { yPercent: -105 });
  gsap.from(cam, { y: -40, opacity: 0, rotation: -8, duration: .8, delay: .3, ease: 'back.out(1.6)' });

  let stage = 0, shakes = 0;
  btn.onclick = () => {
    if (stage) return; stage = 1;
    btn.classList.remove('pulse'); sfx.click(); flash(180);
    gsap.fromTo(cam, { y: 0 }, { keyframes: { y: [0, 6, 0] }, duration: .25 });
    lead.textContent = 'Printing...';
    c.every(() => { if (stage === 1) sfx.tick(); }, 140);
    gsap.to(pol, { yPercent: 0, duration: 1.5, delay: .4, ease: 'none', onComplete: () => {
      stage = 2; out.style.overflow = 'visible'; out.style.zIndex = 3;
      gsap.to(cam, { scale: .55, y: -34, opacity: .8, duration: .7, ease: 'power2.out' });
      gsap.to(pol, { y: 12, scale: 1.2, rotation: -3, duration: .7, ease: 'back.out(1.4)' });
      lead.textContent = 'Now tap the photo 3 times to shake it';
    } });
  };
  pol.onclick = () => {
    if (stage !== 2 || shakes >= 3) return;
    shakes++; sfx.tick();
    gsap.to(pol, { keyframes: { rotation: [-3, -12, 9, -9, 6, -3] }, duration: .45, ease: 'none' });
    gsap.to(dev, { opacity: 1 - shakes / 3, duration: .6 });
    if (shakes < 3) { lead.textContent = shakes === 1 ? 'Something is appearing... 2 more' : 'Almost there... one more'; return; }
    stage = 3; lead.textContent = '';
    c.later(() => {
      sfx.ding(); conf({ particleCount: 160, spread: 100, origin: { y: .45 } });
      type($('p', pol), CONFIG.CAMERA_CAPTION, 45, c);
      showNext();
    }, 650);
  };
};

export default function Camera() {
  return <Page n={4} setup={setup} />;
}
