import { describe, it, expect, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import DemoFrame from '../src/components/DemoFrame.jsx';
import Level from '../src/components/Level.jsx';
import { levels } from '../src/levels/index.jsx';
import { fixture } from './helpers.js';
import { stubObservers, observers } from './stubs.js';

const byKey = (k) => levels.find((l) => l.key === k);

// Fake a loaded demo whose body is `height` px tall.
function loadWithHeight(frame, height) {
  Object.defineProperty(frame, 'contentDocument', {
    configurable: true,
    get: () => ({ body: { scrollHeight: height } }),
  });
  fireEvent.load(frame);
}

beforeEach(() => stubObservers());

describe('DemoFrame', () => {
  it('loads the original demo document and has an accessible title', () => {
    const { container } = render(<DemoFrame level={byKey('l3')} />);
    const frame = container.querySelector('iframe');
    expect(frame.srcdoc).toBe(fixture('l3', 'demo.html'));
    expect(frame).toHaveAttribute('title', 'Level 3 live demo');
    expect(container.querySelector('.url')).toHaveTextContent('add-to-cart.html');
  });

  it('clamps the height between 220 and 1600px', () => {
    const { container } = render(<DemoFrame level={byKey('l1')} />);
    const frame = container.querySelector('iframe');
    loadWithHeight(frame, 100);
    expect(frame.style.height).toBe('220px');
    loadWithHeight(frame, 5000);
    expect(frame.style.height).toBe('1600px');
    loadWithHeight(frame, 480);
    expect(frame.style.height).toBe('480px');
  });

  it('uses 560px when the demo document cannot be read', () => {
    const { container } = render(<DemoFrame level={byKey('l1')} />);
    const frame = container.querySelector('iframe');
    Object.defineProperty(frame, 'contentDocument', { configurable: true, get: () => { throw new Error('blocked'); } });
    fireEvent.load(frame);
    expect(frame.style.height).toBe('560px');
  });

  it('level 5 is pinned at 640px and never observed', () => {
    const { container } = render(<DemoFrame level={byKey('l5')} />);
    const frame = container.querySelector('iframe');
    loadWithHeight(frame, 300);
    expect(frame.style.height).toBe('640px');
    expect(observers.resize).toHaveLength(0);
  });

  it('reset reloads on the same iframe and drops the old size observer', () => {
    const { container } = render(<Level level={byKey('l2')} />);
    const frame = container.querySelector('iframe');
    loadWithHeight(frame, 400);
    const first = observers.resize.at(-1);
    frame.srcdoc = 'changed';
    fireEvent.click(screen.getByRole('button', { name: '↻ Reset demo' }));
    expect(container.querySelector('iframe')).toBe(frame);
    expect(frame.srcdoc).toBe(fixture('l2', 'demo.html'));
    loadWithHeight(frame, 400);
    expect(first.disconnected).toBe(true);
    expect(observers.resize.at(-1)).not.toBe(first);
  });

  it('unmount disconnects the size observer', () => {
    const { container, unmount } = render(<DemoFrame level={byKey('l1')} />);
    loadWithHeight(container.querySelector('iframe'), 400);
    const obs = observers.resize.at(-1);
    unmount();
    expect(obs.disconnected).toBe(true);
  });
});
