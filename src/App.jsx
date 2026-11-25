import TopNav from './components/TopNav.jsx';
import Hero from './components/Hero.jsx';
import Strip from './components/Strip.jsx';
import SectionNav from './components/SectionNav.jsx';
import Level from './components/Level.jsx';
import Footer from './components/Footer.jsx';
import { levels } from './levels/index.jsx';

// "Level N of 5" counts the numbered levels only, not the Level 0 warm-up.
const numberedLevels = levels.filter((l) => l.n >= 1).length;

export default function App() {
  return (
    <>
      <TopNav />
      <Hero />
      <Strip />
      <SectionNav levels={levels} />
      <main>
        {levels.map((level) => <Level key={level.key} level={level} total={numberedLevels} />)}
      </main>
      <Footer />
    </>
  );
}
