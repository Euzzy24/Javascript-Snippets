import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import CodeBox from '../src/components/CodeBox.jsx';
import { levels } from '../src/levels/index.jsx';
import { fixture } from './helpers.js';

const l1 = levels.find((l) => l.key === 'l1');
const tab = (name) => screen.getByRole('tab', { name });
const flush = () => act(async () => {});

let writeText;

beforeEach(() => {
  writeText = vi.fn(() => Promise.resolve());
  Object.defineProperty(navigator, 'clipboard', { value: { writeText }, configurable: true });
  document.execCommand = vi.fn(() => false);
});

afterEach(() => {
  vi.useRealTimers();
});

describe('CodeBox tabs', () => {
  it('starts on page.html and shows the linked page', () => {
    const { container } = render(<CodeBox level={l1} />);
    expect(tab('page.html')).toHaveAttribute('aria-selected', 'true');
    expect(container.querySelector('code').textContent).toContain('<link rel="stylesheet" href="style.css">');
  });

  it('switching to script.js selects only that tab and shows its line count', () => {
    const { container } = render(<CodeBox level={l1} />);
    fireEvent.click(tab('script.js'));
    expect(tab('script.js')).toHaveAttribute('aria-selected', 'true');
    expect(tab('page.html')).toHaveAttribute('aria-selected', 'false');
    expect(tab('style.css')).toHaveAttribute('aria-selected', 'false');
    const expected = fixture('l1', 'script.js').split('\n').length;
    expect(container.querySelector('.lines')).toHaveTextContent(`${expected} lines`);
  });

  it('renders one line span per code line, with empty lines kept', () => {
    const { container } = render(<CodeBox level={l1} />);
    const expected = fixture('l1', 'page.html').split('\n').length;
    expect(container.querySelectorAll('code .ln')).toHaveLength(expected);
  });

  it('ArrowRight on the last tab wraps to page.html and focuses it', () => {
    render(<CodeBox level={l1} />);
    fireEvent.click(tab('script.js'));
    fireEvent.keyDown(tab('script.js'), { key: 'ArrowRight' });
    expect(tab('page.html')).toHaveAttribute('aria-selected', 'true');
    expect(tab('page.html')).toHaveFocus();
  });

  it('ArrowLeft on the first tab wraps to script.js', () => {
    render(<CodeBox level={l1} />);
    fireEvent.keyDown(tab('page.html'), { key: 'ArrowLeft' });
    expect(tab('script.js')).toHaveAttribute('aria-selected', 'true');
    expect(tab('script.js')).toHaveFocus();
  });

  it('tabs keep the original ids and tablist label', () => {
    render(<CodeBox level={l1} />);
    expect(screen.getByRole('tablist')).toHaveAttribute('aria-label', 'Level 1 - Button Clicks files');
    expect(tab('page.html').id).toBe('l1-tab-0');
    expect(tab('script.js').id).toBe('l1-tab-2');
  });
});

describe('CodeBox copy', () => {
  it('copies the current file exactly and shows Copied, then resets after 1.6s', async () => {
    vi.useFakeTimers();
    render(<CodeBox level={l1} />);
    fireEvent.click(tab('style.css'));
    fireEvent.click(screen.getByRole('button', { name: 'Copy this file' }));
    await flush();
    expect(writeText).toHaveBeenCalledWith(fixture('l1', 'style.css'));
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();
    act(() => { vi.advanceTimersByTime(1600); });
    expect(screen.getByRole('button', { name: 'Copy this file' })).toBeInTheDocument();
  });

  it('Copy as one HTML file copies the original single-file output', async () => {
    render(<CodeBox level={l1} />);
    fireEvent.click(screen.getByRole('button', { name: 'Copy as one HTML file' }));
    await flush();
    expect(writeText).toHaveBeenCalledWith(fixture('l1', 'single.html'));
  });

  it('when both copy methods fail, selects the code and says press Ctrl+C', async () => {
    writeText.mockImplementation(() => Promise.reject(new Error('denied')));
    const { container } = render(<CodeBox level={l1} />);
    fireEvent.click(screen.getByRole('button', { name: 'Copy this file' }));
    await flush();
    expect(screen.getByRole('button', { name: 'Selected: press Ctrl+C' })).toBeInTheDocument();
    const sel = window.getSelection();
    expect(sel.rangeCount).toBe(1);
    expect(container.querySelector('pre').contains(sel.getRangeAt(0).startContainer)).toBe(true);
  });

  it('falls back to execCommand and removes the temporary textarea', async () => {
    writeText.mockImplementation(() => Promise.reject(new Error('denied')));
    document.execCommand = vi.fn(() => true);
    render(<CodeBox level={l1} />);
    fireEvent.click(screen.getByRole('button', { name: 'Copy this file' }));
    await flush();
    expect(document.execCommand).toHaveBeenCalledWith('copy');
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();
    expect(document.querySelector('textarea')).toBeNull();
  });

  it('a second click restarts the timer; the other button keeps its own label', async () => {
    vi.useFakeTimers();
    render(<CodeBox level={l1} />);
    fireEvent.click(screen.getByRole('button', { name: 'Copy this file' }));
    await flush();
    act(() => { vi.advanceTimersByTime(1000); });
    fireEvent.click(screen.getByRole('button', { name: 'Copied' }));
    await flush();
    act(() => { vi.advanceTimersByTime(600); });
    expect(screen.getByRole('button', { name: 'Copied' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Copy as one HTML file' })).toBeInTheDocument();
    act(() => { vi.advanceTimersByTime(1000); });
    expect(screen.getByRole('button', { name: 'Copy this file' })).toBeInTheDocument();
  });
});
