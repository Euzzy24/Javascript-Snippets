import { describe, it, expect, beforeAll } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import Level from '../src/components/Level.jsx';
import App from '../src/App.jsx';
import { levels } from '../src/levels/index.jsx';
import { stubObservers } from './stubs.js';

const byKey = (k) => levels.find((l) => l.key === k);

beforeAll(() => stubObservers());

describe('Level', () => {
  it('renders heading, difficulty, meter and learn chips for level 3', () => {
    const { container } = render(<Level level={byKey('l3')} />);
    const section = container.querySelector('section.level');
    expect(section.id).toBe('level-3');
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Add to cart');
    expect(container.querySelector('.diff')).toHaveTextContent(/^Medium/);
    expect(container.querySelectorAll('.meter i')).toHaveLength(5);
    expect(container.querySelectorAll('.meter i.on')).toHaveLength(3);
    expect(container.querySelectorAll('.learn li')).toHaveLength(6);
  });

  it('keeps inline <code> in the intro', () => {
    const { container } = render(<Level level={byKey('l3')} />);
    expect(container.querySelector('.intro code')).toHaveTextContent('renderCart()');
  });

  it('meter has one filled bar for level 1 and five for level 5', () => {
    const one = render(<Level level={byKey('l1')} />);
    expect(one.container.querySelectorAll('.meter i.on')).toHaveLength(1);
    one.unmount();
    const five = render(<Level level={byKey('l5')} />);
    expect(five.container.querySelectorAll('.meter i.on')).toHaveLength(5);
  });

  it('shows <b>Ana</b> as literal text inside <code> in a level 4 Try-it item', () => {
    const { container } = render(<Level level={byKey('l4')} />);
    const codes = [...container.querySelectorAll('.try code')].map((c) => c.textContent);
    expect(codes).toContain('escapeHTML()');
    expect(codes).toContain('<b>Ana</b>');
    expect(container.querySelector('.try b')).toBeNull();
  });

  it('shows the literal <dialog> learn chip for level 5', () => {
    const { container } = render(<Level level={byKey('l5')} />);
    const chips = [...container.querySelectorAll('.learn li')].map((li) => li.textContent);
    expect(chips).toContain('<dialog>');
  });

  it('level 5 uses its own lab note and reset label', () => {
    const { container } = render(<Level level={byKey('l5')} />);
    expect(container.querySelector('.lab-label')).toHaveTextContent('level 5 of 5 · refresh keeps your cart');
    expect(screen.getByRole('button', { name: '↻ Refresh demo' })).toBeInTheDocument();
  });

  it('other levels use the default label', () => {
    const { container } = render(<Level level={byKey('l2')} />);
    expect(container.querySelector('.lab-label')).toHaveTextContent('level 2 of 5');
    expect(screen.getByRole('button', { name: '↻ Reset demo' })).toBeInTheDocument();
  });
});

describe('Level 0 warm-up', () => {
  it('renders as 00 with a warm-up label and an empty meter', () => {
    const { container } = render(<Level level={byKey('l0')} />);
    expect(container.querySelector('section.level').id).toBe('level-0');
    expect(container.querySelector('.num')).toHaveTextContent('00');
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Click anything, see JavaScript work');
    expect(container.querySelector('.diff')).toHaveTextContent(/^Warm-up/);
    expect(container.querySelectorAll('.meter i')).toHaveLength(5);
    expect(container.querySelectorAll('.meter i.on')).toHaveLength(0);
    expect(container.querySelector('.lab-label')).toHaveTextContent(/^level 0 · warm-up$/);
  });

  it('has its intro, 6 learn chips and 4 Try-it items', () => {
    const { container } = render(<Level level={byKey('l0')} />);
    expect(container.querySelector('.intro')).toHaveTextContent('Plain HTML items');
    expect(container.querySelectorAll('.learn li')).toHaveLength(6);
    expect(container.querySelectorAll('.try li')).toHaveLength(4);
    expect([...container.querySelectorAll('.try code')].map((c) => c.textContent)).toContain('<blockquote>');
  });
});

describe('App shell', () => {
  it('numbered levels still say "of 5" with the warm-up added', () => {
    const { container } = render(<App />);
    const label = (n) => container.querySelector(`#level-${n} .lab-label`).textContent;
    expect(label(0)).toBe('level 0 · warm-up');
    expect(label(1)).toBe('level 1 of 5');
    expect(label(5)).toBe('level 5 of 5 · refresh keeps your cart');
  });

  it('has the anchor ids, the main wrapper and the footer', () => {
    const { container } = render(<App />);
    expect(container.querySelector('#top')).not.toBeNull();
    const ids = [...container.querySelectorAll('main > section.level')].map((s) => s.id);
    expect(ids).toEqual(['level-0', 'level-1', 'level-2', 'level-3', 'level-4', 'level-5']);
    for (let n = 0; n <= 5; n++) expect(container.querySelector(`main > #level-${n}`)).not.toBeNull();
    expect(within(container.querySelector('footer')).getByText(/sample data; no order is actually placed/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Snippets' })).toHaveAttribute('aria-current', 'page');
  });
});
