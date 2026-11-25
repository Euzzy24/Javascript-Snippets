const WAVE_OFFSETS = [0, 22, 44, 66, 88, 110, 132, 154, 176];

export default function Hero() {
  return (
    <section className="hero" id="top">
      <svg className="waves" viewBox="0 0 660 240" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <path id="wv" d="M0 30 C 110 0, 210 0, 330 34 S 560 70, 660 10" fill="none" stroke="currentColor" strokeWidth="1.2" />
        </defs>
        {WAVE_OFFSETS.map((y) => <use key={y} href="#wv" y={y} />)}
      </svg>
      <div className="wrap">
        <p className="eyebrow">IT55 · JavaScript in your system</p>
        <h1>JavaScript <span>Snippets</span></h1>
        <p className="lede">A click-anything warm-up and five working examples, from a single button click to a mini shop with a cart that remembers. Try each demo, then copy its HTML, CSS and JavaScript into your own project.</p>
        <ol className="steps">
          <li><span className="n">1</span><span><b>Try</b> the live demo</span></li>
          <li><span className="n">2</span><span><b>Copy</b> page.html, style.css, script.js</span></li>
          <li><span className="n">3</span><span><b>Change</b> it and refresh</span></li>
        </ol>
      </div>
    </section>
  );
}
