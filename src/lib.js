// Shared helpers used by every page: DOM shortcuts, sound, effects, navigation.
import gsap from 'gsap';
import confetti from 'canvas-confetti';
import { Howl, Howler } from 'howler';
import { CONFIG } from './config.js';

export const $ = (s, r = document) => r.querySelector(s);
export const $$ = (s, r = document) => [...r.querySelectorAll(s)];
export const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
export const rand = (a, b) => a + Math.random() * (b - a);
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
export const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
export const COLORS = ['#FFD166', '#FF7EB3', '#9B6BFF', '#4FC3F7', '#FFF8EC', '#6EE7B7'];
export const TOTAL = 10;

/* ---------- navigation (App.jsx plugs the real handlers in) ---------- */
export const nav = { cur: 1, go() {}, showNext() {} };
export const go = n => nav.go(n);
export const showNext = () => nav.showNext();

/* ---------- photos (falls back to a labelled placeholder) ---------- */
function placeholder(n) {
  const h = [45, 330, 265, 200][n % 4];
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='600'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0' stop-color='hsl(${h},70%,62%)'/><stop offset='1' stop-color='hsl(${h + 40},60%,30%)'/></linearGradient></defs><rect width='600' height='600' fill='url(#g)'/><text x='300' y='300' font-family='sans-serif' font-size='70' font-weight='700' fill='white' text-anchor='middle'>PHOTO-${n}</text><text x='300' y='360' font-family='sans-serif' font-size='28' fill='white' opacity='.8' text-anchor='middle'>photo${n}</text></svg>`;
  return 'data:image/svg+xml,' + encodeURIComponent(svg);
}
// photo1, photo2 ... in any common format: try each extension in turn, then show the placeholder
const EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.JPG', '.JPEG', '.PNG', '.WEBP'];
window.ph = (img, n) => {
  const k = (+img.dataset.k || 0) + 1; img.dataset.k = k;
  if (k < EXTS.length) img.src = CONFIG.PHOTO_DIR + 'photo' + n + EXTS[k];
  else { img.onerror = null; img.src = placeholder(n); }
};
export const pic = n => `<img src="${CONFIG.PHOTO_DIR}photo${n}${EXTS[0]}" onerror="ph(this,${n})" alt="" draggable="false">`;

/* ---------- sound ---------- */
let AC = null, gestured = false, music = null;
export let muted = false;
export function audio() {
  if (!gestured) return null;
  if (!AC) { try { AC = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; } }
  if (AC.state === 'suspended') AC.resume();
  return AC;
}
export function tone(f, d = .15, type = 'sine', v = .15, slide) {
  if (muted) return; const a = audio(); if (!a) return;
  const o = a.createOscillator(), g = a.createGain();
  o.type = type; o.frequency.value = f;
  if (slide) o.frequency.exponentialRampToValueAtTime(slide, a.currentTime + d);
  g.gain.setValueAtTime(v, a.currentTime); g.gain.exponentialRampToValueAtTime(.001, a.currentTime + d);
  o.connect(g); g.connect(a.destination); o.start(); o.stop(a.currentTime + d);
}
export const sfx = {
  tick: () => tone(900, .06, 'square', .07),
  pop: () => tone(520, .13, 'triangle', .28, 70),
  boom: () => tone(130, .9, 'sawtooth', .32, 30),
  click: () => tone(320, .08, 'square', .12),
  buzz: () => tone(140, .25, 'sawtooth', .12),
  ding: () => { tone(880, .3, 'sine', .15); setTimeout(() => tone(1320, .5, 'sine', .15), 120); },
  chime: () => [1318, 1568, 2093].forEach((f, i) => setTimeout(() => tone(f, 1.2, 'sine', .08), i * 140))
};
export const MUSIC_VOL = .45;
export function startMusic() {
  if (music) return;
  music = new Howl({ src: [CONFIG.MUSIC_SRC], loop: true, volume: MUSIC_VOL, html5: true });
  music.play();
}
export function musicVol(v, ms = 600) { if (music) music.fade(music.volume(), v, ms); }
export function toggleMute() { muted = !muted; Howler.mute(muted); return muted; }
addEventListener('pointerdown', () => { gestured = true; startMusic(); }, true);

/* ---------- shared effects ---------- */
export const conf = o => confetti(Object.assign({ colors: COLORS }, o));
export function flash(ms = 200) { gsap.fromTo('#flash', { opacity: 1 }, { opacity: 0, duration: ms / 1000 + .3 }); }
export function burst(root, x, y, n, colors, dist = 160, size = 8) {
  for (let i = 0; i < n; i++) {
    const f = el('i', 'frag');
    f.style.cssText = `left:${x}px;top:${y}px;width:${size}px;height:${size}px;background:${colors[i % colors.length]}`;
    root.append(f);
    const a = Math.random() * 6.283, d = rand(dist * .3, dist);
    gsap.to(f, { x: Math.cos(a) * d, y: Math.sin(a) * d, rotation: rand(-360, 360), opacity: 0, scale: rand(.2, 1), duration: rand(.6, 1.1), ease: 'power2.out', onComplete: () => f.remove() });
  }
}
export function stars(box, n) {
  let h = '';
  for (let i = 0; i < n; i++) { const s = rand(1, 3); h += `<i style="left:${rand(0, 100)}%;top:${rand(0, 100)}%;width:${s}px;height:${s}px;animation-duration:${rand(2, 4)}s;animation-delay:${-rand(0, 4)}s"></i>`; }
  box.innerHTML = h;
}
export function type(node, text, ms, c) {
  return new Promise(res => {
    let i = 0; node.textContent = '';
    const step = () => { node.textContent = text.slice(0, ++i); if (i < text.length) c.later(step, ms); else res(); };
    text ? step() : res();
  });
}

/* ---------- per-page lifetime: timers, loops and listeners that die with the page ---------- */
export function makeCtx() {
  const t = [], iv = [], offs = []; let dead = false;
  return {
    get dead() { return dead; },
    later(fn, ms) { t.push(setTimeout(() => { if (!dead) fn(); }, ms)); },
    every(fn, ms) { iv.push(setInterval(() => { if (!dead) fn(); }, ms)); },
    wait(ms) { return new Promise(res => this.later(res, ms)); },
    loop(fn) { let last = performance.now(); const step = now => { if (dead) return; fn(Math.min((now - last) / 1000, .05), now); last = now; requestAnimationFrame(step); }; requestAnimationFrame(step); },
    on(target, ev, fn, opt) { target.addEventListener(ev, fn, opt); offs.push(() => target.removeEventListener(ev, fn, opt)); },
    cleanup(fn) { offs.push(fn); },
    kill() { dead = true; t.forEach(clearTimeout); iv.forEach(clearInterval); offs.forEach(f => f()); }
  };
}
