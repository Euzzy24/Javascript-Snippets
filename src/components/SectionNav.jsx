import { useActiveSection } from '../hooks/useActiveSection.js';

const LABELS = {
  l0: 'Click anything',
  l1: 'Button clicks',
  l2: 'Likes & reactions',
  l3: 'Add to cart',
  l4: 'Checkout',
  l5: 'Mini shop',
};

export default function SectionNav({ levels }) {
  const ids = levels.map((l) => `level-${l.n}`);
  const active = useActiveSection(ids);
  return (
    <nav className="secnav" aria-label="Levels">
      <div className="wrap scroll">
        <div className="row">
          {levels.map((l) => {
            const id = `level-${l.n}`;
            return (
              <a key={id} href={`#${id}`} className={active === id ? 'on' : undefined}>
                <b>{String(l.n).padStart(2, '0')}</b>{LABELS[l.key]}
              </a>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
