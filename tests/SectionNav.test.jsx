import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import App from '../src/App.jsx';
import { stubObservers, observers } from './stubs.js';

const link = (name) => screen.getByRole('link', { name });
const navObserver = () => observers.intersection.at(-1);
const report = (id, isIntersecting) => act(() => {
  navObserver().callback([{ target: document.getElementById(id), isIntersecting }]);
});

beforeEach(() => stubObservers());

describe('SectionNav', () => {
  it('observes all six sections with the original reading band', () => {
    render(<App />);
    expect(navObserver().targets.map((t) => t.id)).toEqual(['level-0', 'level-1', 'level-2', 'level-3', 'level-4', 'level-5']);
    expect(navObserver().options.rootMargin).toBe('-30% 0px -60% 0px');
  });

  it('lists the warm-up first and highlights it when in view', () => {
    const { container } = render(<App />);
    expect(container.querySelector('.secnav a').textContent).toBe('00Click anything');
    report('level-0', true);
    expect(link('00Click anything')).toHaveClass('on');
  });

  it('nothing is highlighted at first', () => {
    const { container } = render(<App />);
    expect(container.querySelectorAll('.secnav a.on')).toHaveLength(0);
  });

  it('highlights the level that enters the band, and only that one', () => {
    const { container } = render(<App />);
    report('level-4', true);
    expect(link('04Checkout')).toHaveClass('on');
    expect(container.querySelectorAll('.secnav a.on')).toHaveLength(1);
  });

  it('keeps the highlight when the level leaves the band', () => {
    render(<App />);
    report('level-4', true);
    report('level-4', false);
    expect(link('04Checkout')).toHaveClass('on');
  });

  it('disconnects when the app unmounts', () => {
    const { unmount } = render(<App />);
    const obs = navObserver();
    unmount();
    expect(obs.disconnected).toBe(true);
  });
});
