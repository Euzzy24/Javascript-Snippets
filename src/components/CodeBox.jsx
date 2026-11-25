import { useEffect, useMemo, useRef, useState } from 'react';
import { levelFiles, singleFile } from '../lib/snippetFiles.js';
import { highlight } from '../lib/highlight.js';
import { copyText } from '../lib/clipboard.js';

const LABEL_MS = 1600;
const DEFAULT_LABELS = { tab: 'Copy this file', all: 'Copy as one HTML file' };

// File tabs (page.html / style.css / script.js), the code, and copy buttons.
export default function CodeBox({ level }) {
  const files = useMemo(() => levelFiles(level), [level]);
  const names = Object.keys(files);
  const [current, setCurrent] = useState(names[0]);
  const [labels, setLabels] = useState(DEFAULT_LABELS);
  const preRef = useRef(null);
  const tabRefs = useRef({});
  const timers = useRef({});

  useEffect(() => () => Object.values(timers.current).forEach(clearTimeout), []);

  const show = (name) => {
    setCurrent(name);
    if (preRef.current) preRef.current.scrollTop = 0;
  };

  const onKeyDown = (e) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const i = names.indexOf(current) + (e.key === 'ArrowRight' ? 1 : -1);
    const next = names[(i + names.length) % names.length];
    show(next);
    tabRefs.current[next]?.focus();
  };

  const copy = async (which) => {
    const ok = which === 'tab'
      ? await copyText(files[current], preRef.current)
      : await copyText(singleFile(level.html, level.css, level.js, level.title), null);
    setLabels((l) => ({ ...l, [which]: ok ? 'Copied' : 'Selected: press Ctrl+C' }));
    clearTimeout(timers.current[which]);
    timers.current[which] = setTimeout(() => {
      setLabels((l) => ({ ...l, [which]: DEFAULT_LABELS[which] }));
    }, LABEL_MS);
  };

  const text = files[current];
  const lines = highlight(text);

  return (
    <div className="codebox">
      <div className="tabs" role="tablist" aria-label={`${level.title} files`} onKeyDown={onKeyDown}>
        {names.map((name, i) => (
          <button
            key={name}
            ref={(el) => { tabRefs.current[name] = el; }}
            className="tab"
            role="tab"
            id={`${level.key}-tab-${i}`}
            aria-selected={name === current}
            onClick={() => show(name)}
          >
            {name}
          </button>
        ))}
      </div>
      <pre ref={preRef} tabIndex={0} aria-live="polite"><code>
        {lines.map((line, i) => (
          <span className="ln" key={i}>
            {line.isComment ? <span className="c">{line.text}</span> : line.text}
          </span>
        ))}
      </code></pre>
      <div className="acts">
        <button className="btn" onClick={() => copy('tab')}>{labels.tab}</button>
        <button className="btn ghost" onClick={() => copy('all')}>{labels.all}</button>
        <small className="lines">{text.split('\n').length} lines</small>
      </div>
    </div>
  );
}
