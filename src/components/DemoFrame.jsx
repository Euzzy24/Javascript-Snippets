import { useEffect, useMemo, useRef } from 'react';
import { demoDoc } from '../lib/snippetFiles.js';
import { demoFallback } from '../levels/index.jsx';

const MIN_H = 220;
const MAX_H = 1600;
const FALLBACK_H = 560;

// Live demo in a fake browser window. Sizes itself to its content, unless
// the level pins a fixed height. A change in `resets` reloads the demo on the
// same iframe element, so the page does not jump.
export default function DemoFrame({ level, resets = 0 }) {
  const frameRef = useRef(null);
  const doc = useMemo(
    () => demoDoc(level.html, level.css, level.js, demoFallback),
    [level.html, level.css, level.js],
  );

  useEffect(() => {
    const frame = frameRef.current;
    let observer = null;
    const stopObserving = () => {
      if (observer) { observer.disconnect(); observer = null; }
    };
    const onLoad = () => {
      stopObserving();
      if (level.fixedHeight) { frame.style.height = level.fixedHeight + 'px'; return; }
      try {
        const body = frame.contentDocument.body;
        const fit = () => { frame.style.height = Math.min(Math.max(body.scrollHeight, MIN_H), MAX_H) + 'px'; };
        fit();
        observer = new ResizeObserver(fit);
        observer.observe(body);
      } catch (err) {
        frame.style.height = FALLBACK_H + 'px';
      }
    };
    frame.addEventListener('load', onLoad);
    return () => {
      frame.removeEventListener('load', onLoad);
      stopObserving();
    };
  }, [level.fixedHeight]);

  useEffect(() => {
    frameRef.current.srcdoc = doc;
  }, [doc, resets]);

  return (
    <div className="browser">
      <div className="bar">
        <span className="dots"><i /><i /><i /></span>
        <span className="url">{level.url}</span>
      </div>
      <iframe ref={frameRef} title={`Level ${level.n} live demo`} />
    </div>
  );
}
