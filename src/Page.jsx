import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { makeCtx } from './lib.js';

// Wrapper every page uses: mounts a full-screen section, plays the zoom-in
// transition, runs the page's animation setup, and tears it all down on leave.
export default function Page({ n, setup }) {
  const ref = useRef(null);
  useEffect(() => {
    const root = ref.current, c = makeCtx();
    gsap.fromTo(root, { opacity: 0, scale: .9 }, { opacity: 1, scale: 1, duration: .8, ease: 'power2.out', clearProps: 'transform' });
    setup(root, c);
    return () => {
      c.kill();
      gsap.killTweensOf(root); gsap.killTweensOf(root.querySelectorAll('*'));
      root.innerHTML = '';
    };
  }, [setup]);
  return <section ref={ref} id={'p' + n} className="page on" />;
}
