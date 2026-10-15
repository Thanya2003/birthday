import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { PAGES, PAGE_IDS, PAGE_TITLES } from './pages/index.js';
import { CONFIG } from './config.js';
import { TOTAL, clamp, nav, rand, sfx, toggleMute } from './lib.js';

function firstPage() {
  let n = 1;
  const m = location.hash.match(/page=(\d+)/);
  try { n = m ? +m[1] : +(localStorage.getItem('bday-page') || 1); } catch (e) {}
  return clamp(n || 1, 1, TOTAL);
}

export default function App() {
  const [cur, setCur] = useState(firstPage);
  const [next, setNext] = useState(false);
  const [menu, setMenu] = useState(false);
  const [muted, setMuted] = useState(false);
  const busy = useRef(false);

  const go = useCallback(n => {
    if (busy.current || n < 1 || n > TOTAL || n === nav.cur) return;
    busy.current = true; setNext(false);
    const done = () => { busy.current = false; setCur(n); };
    const old = document.querySelector('.page.on');
    if (old) gsap.to(old, { opacity: 0, scale: 1.1, duration: .6, ease: 'power2.in', onComplete: done }); else done();
  }, []);

  nav.cur = cur; nav.go = go;
  nav.showNext = () => { if (nav.cur < TOTAL) setNext(true); };

  useEffect(() => {
    document.body.dataset.page = PAGE_IDS[cur - 1];
    try { localStorage.setItem('bday-page', cur); history.replaceState(null, '', '#page=' + cur); } catch (e) {}
  }, [cur]);

  const sparkles = useMemo(() => Array.from({ length: 28 }, (_, i) => (
    <i key={i} style={{ left: rand(0, 100) + '%', top: rand(10, 100) + '%', '--dx': rand(-40, 40) + 'px', animationDuration: rand(7, 14) + 's', animationDelay: -rand(0, 14) + 's' }} />
  )), []);

  const Current = PAGES[cur - 1];
  return (
    <>
      <div id="aurora"><i /><i /><i /></div>
      <div id="stage"><Current key={cur} /></div>
      <div id="sparkles">{sparkles}</div>
      <header id="topbar">
        <div id="bar"><i style={{ width: (cur / TOTAL * 100) + '%' }} /></div>
        <nav id="nav">
          <button id="brand" onClick={() => go(1)}>{CONFIG.SITE_NAME}</button>
          <span id="crumb">{PAGE_TITLES[cur - 1]}</span>
          <div>
            <button id="mute" className={'nbtn' + (muted ? ' off' : '')} aria-label="Mute" onClick={() => setMuted(toggleMute())}>♪</button>
            <button className="nbtn" aria-label="Menu" onClick={() => { sfx.click(); setMenu(true); }}>☰</button>
          </div>
        </nav>
      </header>
      <div id="menu" className={menu ? 'on' : ''} onClick={() => setMenu(false)}>
        <button className="nbtn" id="menu-x" aria-label="Close menu">✕</button>
        <p className="script">{CONFIG.SITE_NAME}</p>
        <div id="menu-list">
          {PAGE_TITLES.map((t, i) => (
            <button key={t} className={i + 1 === cur ? 'cur' : ''} onClick={() => go(i + 1)}>{t}</button>
          ))}
        </div>
      </div>
      <button id="next" className={'btn' + (next ? ' show' : '')} onClick={() => { sfx.click(); go(cur + 1); }}>Next →</button>
      <div id="flash" />
    </>
  );
}
