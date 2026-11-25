import { useState } from 'react';
import CodeBox from './CodeBox.jsx';
import DemoFrame from './DemoFrame.jsx';

const pad = (n) => String(n).padStart(2, '0');

export default function Level({ level, total = 5 }) {
  const [resets, setResets] = useState(0);
  const { n, heading, difficulty, meter, intro, learn, tryIt } = level;

  return (
    <section className="level" id={`level-${n}`}>
      <div className="wrap">
        <div className="sec-head">
          <span className="num">{pad(n)}</span>
          <div>
            <h2>{heading}</h2>
            <span className="diff">
              {difficulty}{' '}
              <span className="meter">
                {Array.from({ length: total }, (_, i) => <i key={i} className={i < meter ? 'on' : undefined} />)}
              </span>
            </span>
          </div>
        </div>
        <div className="sec-body">
          <p className="intro">{intro}</p>
          <ul className="learn">{learn.map((item) => <li key={item}>{item}</li>)}</ul>
        </div>
        <div className="lab">
          <div className="lab-top">
            <span className="lab-label">
              <b>level</b> {level.labLabel ? `${n} · ${level.labLabel}` : `${n} of ${total}`}{level.labNote}
            </span>
            <button className="btn ghost" onClick={() => setResets((r) => r + 1)}>{level.resetLabel ?? '↻ Reset demo'}</button>
          </div>
          <div className="lab-grid">
            <DemoFrame level={level} resets={resets} />
            <CodeBox level={level} />
          </div>
        </div>
        <div className="try">
          <h3>Try it</h3>
          <ul>{tryIt.map((item, i) => <li key={i}>{item}</li>)}</ul>
        </div>
      </div>
    </section>
  );
}
