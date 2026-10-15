// Page 13: Sky Lanterns (light each lantern to release a promise, then he sends up as many wishes as he likes)
import gsap from 'gsap';
import Page from '../Page.jsx';
import { CONFIG } from '../config.js';
import { $, $$, el, rand, sfx, stars, showNext } from '../lib.js';

const setup = (root, c) => {
  const P = CONFIG.PROMISES;
  root.innerHTML = `<div class="stars"></div><h2 class="script">Promises to myself</h2>
    <p class="lead" id="ln-l">Tap a lantern to make a promise to yourself</p>
    <div id="ln-sky"></div>
    <p class="script" id="ln-msg"></p>
    <div id="ln-ground">${P.map((_, i) => `<button class="lan" data-i="${i}" aria-label="Lantern ${i + 1}"></button>`).join('')}</div>
    <form id="ln-form"><input id="ln-in" type="text" maxlength="60" autocomplete="off" placeholder="Write your own wish..." aria-label="Your wish">
      <button class="btn" id="ln-go" disabled>Release my lantern</button></form>`;
  stars($('.stars', root), 80);
  const sky = $('#ln-sky', root), msg = $('#ln-msg', root), lead = $('#ln-l', root), form = $('#ln-form', root);
  // the release button only wakes up once he has typed something
  $('#ln-in', root).oninput = e => { $('#ln-go', root).disabled = !e.target.value.trim(); };
  gsap.from($$('.lan', root), { y: 60, opacity: 0, duration: .6, stagger: .1, delay: .4, ease: 'back.out(1.6)' });

  const say = text => gsap.to(msg, { opacity: 0, duration: .25, onComplete: () => { msg.textContent = text; gsap.to(msg, { opacity: 1, duration: .6 }); } });
  // light a lantern where it stands, then let it rise to its place in the sky and drift there
  function release(lan, x, y, scale) {
    const r = lan.getBoundingClientRect();
    if (lan.parentNode !== sky) { const gap = lan.cloneNode(); gap.style.visibility = 'hidden'; lan.replaceWith(gap); sky.append(lan); }
    gsap.set(lan, { clearProps: 'all' });
    lan.style.left = r.left + 'px'; lan.style.top = r.top + 'px';
    lan.classList.add('lit');
    gsap.to(lan, { x: x - r.left, y: y - r.top, scale, duration: 3.6, delay: .5, ease: 'power1.inOut', onComplete: () => {
      gsap.to(lan, { y: '+=' + rand(-14, -8), x: '+=' + rand(-8, 8), duration: rand(2.4, 3.6), yoyo: true, repeat: -1, ease: 'sine.inOut' });
    } });
  }

  let lit = 0, lock = false;
  $$('.lan', root).forEach(lan => lan.onclick = () => {
    if (lock || lan.classList.contains('lit')) return;
    lock = true; c.later(() => { lock = false; }, 1500);
    const i = +lan.dataset.i; sfx.chime();
    say(P[i]);
    release(lan, (i + .5) / P.length * innerWidth * .84 + innerWidth * .08 - 25, (i % 2 ? 210 : 150) + rand(-12, 12), .62);
    if (++lit === P.length) c.later(() => {
      say('');
      lead.textContent = 'Now write your own wishes and let them fly.';
      $('#ln-ground', root).style.display = 'none';
      form.classList.add('on'); gsap.from(form, { y: 30, opacity: 0, duration: .6 });
    }, 4200);
  });

  // he can send as many wishes as he likes; each one becomes its own lantern
  let sent = 0;
  form.onsubmit = e => {
    e.preventDefault();
    const input = $('#ln-in', root), go = $('#ln-go', root), wish = input.value.trim();
    if (!wish) return;
    input.value = ''; go.disabled = true; input.blur();
    form.classList.remove('on'); sfx.chime();
    const k = sent++, mine = el('div', 'lan mine'); sky.append(mine);
    mine.style.left = (innerWidth / 2 - 25) + 'px'; mine.style.top = (innerHeight - 190) + 'px';
    if (k === 0) release(mine, innerWidth / 2 - 25, 255, 1.4);
    else release(mine, rand(innerWidth * .06, innerWidth * .94 - 50), rand(180, 290), rand(.85, 1.1));
    lead.textContent = 'Your wish is on its way to the sky';
    c.later(() => say(`“${wish}”`), 1200);
    c.later(() => {
      lead.textContent = `${sent} ${sent === 1 ? 'wish' : 'wishes'} in the sky. Write another, or tap Next when you are done.`;
      input.placeholder = 'Write another wish...'; go.textContent = 'Release another lantern';
      form.classList.add('on'); gsap.from(form, { y: 20, opacity: 0, duration: .5 });
      showNext();
    }, 3800);
  };
};

export default function Lanterns() {
  return <Page n={13} setup={setup} />;
}
