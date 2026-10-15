// Page 1: Home (the landing page)
import gsap from 'gsap';
import Page from '../Page.jsx';
import { CONFIG } from '../config.js';
import { $, pic, sfx, startMusic, conf, stars, go } from '../lib.js';

const setup = (root, c) => {
  root.innerHTML = `<div class="stars"></div>
    <p class="eyebrow">${CONFIG.HOME_BADGE}</p>
    <div class="hero-photo"><i class="ring"></i><div class="ph">${pic(23)}</div></div>
    <h1 class="script">Happy Birthday<br>${CONFIG.HIS_NAME}</h1>
    <button class="btn pulse" id="h-go">Start the celebration</button>
    <p class="hero-note">A little website, made just for you</p>`;
  stars($('.stars', root), 90);
  gsap.from(root.querySelectorAll(':scope > :not(.stars)'), { y: 30, opacity: 0, duration: .8, stagger: .18, delay: .3, ease: 'power3.out' });
  gsap.from($('.hero-photo', root), { scale: .5, duration: 1, delay: .5, ease: 'back.out(1.6)' });
  c.later(() => conf({ particleCount: 90, spread: 100, origin: { y: .3 } }), 1700);
  $('#h-go', root).onclick = () => {
    sfx.click(); startMusic();
    conf({ particleCount: 120, spread: 80, origin: { y: .7 } });
    go(2);
  };
};

export default function Home() {
  return <Page n={1} setup={setup} />;
}
