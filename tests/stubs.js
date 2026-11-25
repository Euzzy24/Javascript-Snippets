// jsdom has no IntersectionObserver or ResizeObserver. These stubs record
// what was observed and let tests fire entries by hand.
export const observers = { intersection: [], resize: [] };

class StubObserver {
  constructor(callback, options, list) {
    this.callback = callback;
    this.options = options;
    this.targets = [];
    this.disconnected = false;
    list.push(this);
  }
  observe(el) { this.targets.push(el); }
  unobserve() {}
  disconnect() { this.disconnected = true; }
}

export function stubObservers() {
  observers.intersection.length = 0;
  observers.resize.length = 0;
  globalThis.IntersectionObserver = class extends StubObserver {
    constructor(cb, opts) { super(cb, opts, observers.intersection); }
  };
  globalThis.ResizeObserver = class extends StubObserver {
    constructor(cb, opts) { super(cb, opts, observers.resize); }
  };
}
