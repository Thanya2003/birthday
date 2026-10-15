// Page 10: Jar of Wishes (10 wishes for his life; each one pins to the page with its message)
import gsap from 'gsap';
import Page from '../Page.jsx';
import { CONFIG } from '../config.js';
import { $, $$, el, rand, sfx, conf, type, showNext } from '../lib.js';

const setup = (root, c) => {
  const W = (CONFIG.LIFE_WISHES || []).slice(0, 10);
  const paper = ['#FFF6E3', '#F9DCDC', '#E9DDF7', '#DDEBD8', '#FBE6C2', '#D9E8F5'];
  let notes = '', flies = '';
  for (let i = 0; i < 10; i++) notes += `<rect x="${rand(34, 120)}" y="${rand(120, 200)}" width="26" height="18" rx="3" fill="${paper[i % 6]}" transform="rotate(${rand(-40, 40)} 90 170)"/>`;
  for (let i = 0; i < 10; i++) flies += `<i class="fly" style="left:${rand(22, 72)}%;top:${rand(30, 85)}%;--fx:${rand(-14, 14)}px;--fy:${rand(-18, 18)}px;animation-duration:${rand(2, 5)}s,${rand(1.5, 3.5)}s;animation-delay:${-rand(0, 3)}s,${-rand(0, 3)}s"></i>`;
  root.innerHTML = `<p class="lead" id="j-t">wishes for your life. Tap the jar.</p>
    <p id="j-c" style="color:var(--gold);font-weight:600;min-height:1.5em"></p>
    <div id="j-board" style="grid-template-rows:repeat(${Math.ceil(W.length / 2)},1fr);max-height:${Math.ceil(W.length / 2) * 112}px">${W.map(() => '<div class="slot"></div>').join('')}</div>
    <div id="jar"><svg viewBox="0 0 180 240">
      <path d="M45 34 h90 v14 q25 10 25 40 v120 q0 22 -22 22 h-96 q-22 0 -22 -22 v-120 q0 -30 25 -40 z" fill="rgba(255,255,255,.1)" stroke="rgba(255,255,255,.65)" stroke-width="3"/>
      ${notes}
      <path d="M34 96 v92" stroke="rgba(255,255,255,.45)" stroke-width="6" stroke-linecap="round"/>
      <rect id="j-lid" x="48" y="8" width="84" height="26" rx="6" fill="#B8864B" stroke="#8a5f2c" stroke-width="2"/>
    </svg>${flies}</div>`;
  const jar = $('#jar', root), slots = $$('.slot', root);
  let n = 0, lock = false;

  const makeCard = col => {
    const card = el('div', 'rcard wish', '<small>✦ my wish for you ✦</small><span></span>');
    card.style.background = col; root.append(card);
    gsap.set(card, { xPercent: -50, yPercent: -50 });
    return card;
  };

  jar.onclick = () => {
    if (lock) return;
    if (n >= W.length) { $('#j-t', root).textContent = 'The jar is empty, but my wishes for you never end.'; return; }
    lock = true; sfx.click();
    gsap.fromTo(jar, { rotation: 0 }, { keyframes: { rotation: [0, -6, 6, -4, 4, 0] }, duration: .45 });
    gsap.to($('#j-lid', root), { y: -10, duration: .15, yoyo: true, repeat: 1 });
    const col = paper[n % 6], jr = jar.getBoundingClientRect(), note = el('i', 'jnote');
    note.style.cssText = `left:${jr.left + jr.width / 2 - 13}px;top:${jr.top}px;background:${col}`; root.append(note);
    const dy = innerHeight * .44 - jr.top;
    gsap.to(note, { rotation: 360, duration: .7, ease: 'none' });
    gsap.to(note, { y: dy - 60, duration: .4, ease: 'power2.out' });
    gsap.to(note, { y: dy, duration: .3, delay: .4, ease: 'power2.in', onComplete: () => { note.remove(); unfold(col); } });
  };

  // the paper opens in the middle, the wish writes itself, then it pins to its place on the page
  function unfold(col) {
    const i = n, card = makeCard(col), slot = slots[i];
    gsap.set(card, { scaleX: 0, scaleY: .08 });
    gsap.to(card, { scaleX: 1, duration: .3, ease: 'power2.out' });
    gsap.to(card, { scaleY: 1, duration: .35, delay: .3, ease: 'back.out(1.6)' });
    let pinned = false;
    const pin = () => {
      if (pinned) return; pinned = true;
      gsap.killTweensOf(card); gsap.set(card, { scaleX: 1, scaleY: 1 });
      const cr = card.getBoundingClientRect(), sr = slot.getBoundingClientRect();
      gsap.to(card, { x: sr.left + sr.width / 2 - (cr.left + cr.width / 2), y: sr.top + sr.height / 2 - (cr.top + cr.height / 2), scaleX: sr.width / cr.width, scaleY: sr.height / cr.height, opacity: .3, duration: .5, ease: 'power2.in', onComplete: () => {
        card.remove(); sfx.tick();
        slot.classList.add('full'); slot.textContent = W[i];
        slot.style.background = col; slot.style.transform = `rotate(${rand(-4, 4).toFixed(1)}deg)`;
        gsap.from(slot, { scale: 1.3, opacity: 0, duration: .3, ease: 'back.out(2)' });
        slot.onclick = () => view(i, col);
        n++; lock = false;
        $('#j-c', root).textContent = `${n} of ${W.length} wishes`;
        if (n === W.length) {
          $('#j-t', root).textContent = 'All of these, and so much more, for you.';
          sfx.ding(); conf({ particleCount: 150, spread: 100, origin: { y: .5 } });
          showNext();
        }
      } });
    };
    card.onclick = pin;
    c.later(() => type($('span', card), W[i], 35, c).then(() => c.later(pin, 2500)), 650);
  }

  // tap a pinned wish to read it big again
  function view(i, col) {
    if (lock) return; lock = true;
    const card = makeCard(col); $('span', card).textContent = W[i];
    gsap.from(card, { scale: .3, opacity: 0, duration: .3, ease: 'back.out(1.6)' });
    card.onclick = () => gsap.to(card, { scale: .3, opacity: 0, duration: .25, onComplete: () => { card.remove(); lock = false; } });
  }
};

export default function JarOfWishes() {
  return <Page n={10} setup={setup} />;
}
