// Page 12: Make a Wish
import gsap from 'gsap';
import Page from '../Page.jsx';
import { CONFIG } from '../config.js';
import { $, $$, el, rand, clamp, audio, tone, sfx, conf, showNext } from '../lib.js';

const setup = (root, c) => {
  const N = clamp(CONFIG.CANDLES | 0, 1, 7);
  root.innerHTML = `<div id="ck-dark"></div><h2 class="script" id="ck-t" style="position:relative;z-index:5">Make a wish...</h2>
    <div id="cake"><div class="candles">${'<div class="candle"><i class="flame"></i></div>'.repeat(N)}</div>
      <div class="tier t3"></div><div class="tier t2"></div><div class="tier t1"></div><div class="plate"></div></div>
    <p class="lead" id="ck-l">&nbsp;</p>
    <button class="btn ghost" id="ck-mic" style="visibility:hidden">🎤 Or blow on your phone</button>`;
  const candles = $$('.candle', root), lead = $('#ck-l', root), mic = $('#ck-mic', root);
  ['.plate', '.t1', '.t2', '.t3'].forEach((s, i) => gsap.from($(s, root), { y: -innerHeight, duration: .9, delay: .3 + i * .5, ease: 'bounce.out' }));
  gsap.from($('.candles', root), { scale: 0, transformOrigin: '50% 100%', duration: .5, delay: 2.5, ease: 'back.out(2)' });
  candles.forEach((cd, i) => gsap.to($('.flame', cd), { opacity: 1, duration: .3, delay: 3.1 + i * .2 }));
  let ready = false, out = 0;
  c.later(() => { ready = true; lead.textContent = 'Tap each flame to blow out the candles'; mic.style.visibility = 'visible'; }, 3200 + N * 200);
  function blow(cd) {
    if (!ready || cd.dataset.out) return; cd.dataset.out = 1; out++;
    gsap.killTweensOf($('.flame', cd)); $('.flame', cd).style.display = 'none';
    const s = el('i', 'smoke'); cd.append(s);
    gsap.to(s, { y: -60, x: rand(-14, 14), scale: 3, opacity: 0, duration: 1.4, ease: 'power1.out', onComplete: () => s.remove() });
    tone(300, .2, 'sine', .05, 120);
    if (out === N) finish();
  }
  candles.forEach(cd => cd.onclick = () => blow(cd));
  function finish() {
    mic.style.visibility = 'hidden'; lead.innerHTML = '&nbsp;';
    gsap.to($('#ck-dark', root), { opacity: .75, duration: .8, yoyo: true, repeat: 1, repeatDelay: .8 });
    c.later(() => {
      $('#ck-t', root).textContent = 'Your wish is on its way ✨'; sfx.ding();
      conf({ particleCount: 200, spread: 120, origin: { y: .4 } });
      showNext();
    }, 1700);
  }
  mic.onclick = async () => {
    mic.style.visibility = 'hidden';
    try {
      const a = audio(); if (!a) throw 0;
      const s = await navigator.mediaDevices.getUserMedia({ audio: true });
      c.cleanup(() => s.getTracks().forEach(t => t.stop()));
      const an = a.createAnalyser(); an.fftSize = 512; a.createMediaStreamSource(s).connect(an);
      const buf = new Uint8Array(an.fftSize); let cool = 0;
      lead.textContent = 'Now blow! 🌬️';
      c.loop(dt => {
        if (out >= N) return;
        an.getByteTimeDomainData(buf);
        let sum = 0; for (const v of buf) { const d = (v - 128) / 128; sum += d * d; }
        cool -= dt;
        if (Math.sqrt(sum / buf.length) > .18 && cool <= 0) { cool = .35; blow(candles.find(x => !x.dataset.out)); }
      });
    } catch (e) { lead.textContent = 'No mic, just tap each flame 😊'; }
  };
};

export default function Cake() {
  return <Page n={12} setup={setup} />;
}
