// Page 15: Grand Finale (a heart drawn in light with his age inside, plus fireworks)
import gsap from 'gsap';
import Page from '../Page.jsx';
import { CONFIG } from '../config.js';
import { $, $$, rand, sfx, MUSIC_VOL, musicVol, conf, go } from '../lib.js';

const HEART = 'M100 178 C40 136 8 100 8 62 C8 32 30 12 58 12 C78 12 93 24 100 40 C107 24 122 12 142 12 C170 12 192 32 192 62 C192 100 160 136 100 178Z';
const SMALL_HEART_COLORS = ['#F5C6D6', '#FFF3DC', '#EFD49A'];

const setup = (root, c) => {
  const bd = new Date(CONFIG.BIRTH_DATE), now = new Date();
  let age = now.getFullYear() - bd.getFullYear();
  if (now.getMonth() < bd.getMonth() || (now.getMonth() === bd.getMonth() && now.getDate() < bd.getDate())) age--;
  root.innerHTML = `<h1 class="script shimmer">Happy Birthday<br>${CONFIG.HIS_NAME}</h1>
    <div id="heart"><div id="heart-in">
      <svg viewBox="0 0 200 190"><defs>
        <linearGradient id="hg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF3DC"/><stop offset=".5" stop-color="#F5C6D6"/><stop offset="1" stop-color="#EFD49A"/></linearGradient>
        <radialGradient id="hf" cx=".5" cy=".45" r=".6"><stop offset="0" stop-color="rgba(245,198,214,.45)"/><stop offset="1" stop-color="rgba(245,198,214,0)"/></radialGradient></defs>
        <path class="h-fill" d="${HEART}" fill="url(#hf)"/>
        <path class="h-line" d="${HEART}" fill="none" stroke="url(#hg)" stroke-width="4" stroke-linecap="round"/>
        <path class="h-line" d="${HEART}" fill="none" stroke="url(#hg)" stroke-width="1.2" opacity=".55" transform="translate(100 95) scale(.86) translate(-100 -95)"/>
      </svg>
      <div id="h-age"><b>${isNaN(age) ? '♥' : age}</b><span>years of you</span></div></div></div>
    <div id="fin-btns"><button class="btn ghost" id="f-re">↺ Replay the journey</button><button class="btn pinkb pulse" id="f-one">One last surprise 🎁</button></div>
    <div class="overlay" id="f-ov"><div class="wcard"><h2 class="script" style="color:#c0397a;text-shadow:none">One last surprise</h2><p></p><small>tap to close</small></div></div>`;
  musicVol(.85, 1500); c.cleanup(() => musicVol(MUSIC_VOL));

  // the heart draws itself in light, fills with a soft glow, then his age appears inside and it starts to beat
  $$('.h-line', root).forEach((l, i) => {
    const len = l.getTotalLength();
    gsap.fromTo(l, { strokeDasharray: len, strokeDashoffset: len }, { strokeDashoffset: 0, duration: 2.4, delay: .6 + i * .5, ease: 'power1.inOut' });
  });
  gsap.from($('.h-fill', root), { opacity: 0, duration: 1.2, delay: 2.6 });
  gsap.from($('#h-age', root), { scale: .4, opacity: 0, duration: .9, delay: 2.9, ease: 'back.out(1.8)' });
  c.later(() => gsap.to($('#heart-in', root), { keyframes: { scale: [1, 1.07, 1, 1.05, 1] }, duration: 1.4, repeat: -1, repeatDelay: .3, ease: 'none' }), 3600);

  // little hearts keep floating up from below the big one
  c.every(() => {
    const h = document.createElement('i');
    h.className = 'fh'; h.textContent = '♥';
    h.style.left = rand(8, 92) + '%';
    h.style.fontSize = rand(12, 26) + 'px';
    h.style.color = SMALL_HEART_COLORS[Math.floor(rand(0, 3))];
    $('#heart', root).append(h);
    gsap.fromTo(h, { y: 0, opacity: 0 }, { y: -rand(160, 300), x: rand(-30, 30), opacity: 1, duration: rand(2.6, 4), ease: 'sine.out', onComplete: () => h.remove() });
    gsap.to(h, { opacity: 0, duration: 1, delay: 1.8 });
  }, 450);

  gsap.to($('#fin-btns', root), { opacity: 1, duration: 1, delay: 4 });
  const fire = (x, y) => conf({ particleCount: 70, spread: 360, startVelocity: 26, ticks: 110, gravity: .7, scalar: .9, origin: { x, y } });
  c.later(() => { sfx.boom(); fire(.5, .4); }, 700);
  c.every(() => fire(rand(.12, .88), rand(.12, .5)), 900);
  c.on(root, 'pointerdown', e => { if (e.target.closest('button,.overlay')) return; sfx.pop(); fire(e.clientX / innerWidth, e.clientY / innerHeight); });
  const ov = $('#f-ov', root);
  $('#f-one', root).onclick = () => { $('p', ov).textContent = CONFIG.FINAL_SURPRISE; ov.classList.add('on'); gsap.fromTo($('.wcard', ov), { scale: .3, opacity: 0 }, { scale: 1, opacity: 1, duration: .5, ease: 'back.out(1.6)' }); sfx.ding(); };
  ov.onclick = () => ov.classList.remove('on');
  $('#f-re', root).onclick = () => { try { localStorage.removeItem('bday-page'); } catch (e) {} go(1); };
};

export default function Finale() {
  return <Page n={15} setup={setup} />;
}
