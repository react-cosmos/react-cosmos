// @flow

type Store = { [string]: string };
type onUpdate = Store => void;

// Mocking localStorage completely ensures no conflict with existing browser
// data and works in test environments like Jest
export class LocalStorageMock {
  store: Store;

  onUpdate: onUpdate;

  // Apparently onUpdate type is used before it's defined...
  // eslint-disable-next-line no-use-before-define
  constructor(store: Store = {}, onUpdate: onUpdate) {
    this.store = { ...store };
    this.onUpdate = onUpdate;
  }

  clear() {
    this.store = {};
    this.update();
  }

  getItem(key: string) {
    return this.store[key] || null;
  }

  setItem(key: string, value: { toString: () => string }) {
    this.store[key] = value.toString();
    this.update();
  }

  removeItem(key: string) {
    delete this.store[key];
    this.update();
  }

  update() {
    this.onUpdate(this.store);
  }
}
