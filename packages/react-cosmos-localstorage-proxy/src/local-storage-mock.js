// Mocking localStorage completely ensures no conflict with existing browser
// data and works in test environments like Jest
export class LocalStorageMock {
  constructor(store = {}, onUpdate) {
    this.store = { ...store };
    this.onUpdate = onUpdate;
  }

  clear() {
    this.store = {};
    this.update();
  }

  getItem(key) {
    return this.store[key] || null;
  }

  setItem(key, value) {
    this.store[key] = value.toString();
    this.update();
  }

  removeItem(key) {
    delete this.store[key];
    this.update();
  }

  update() {
    this.onUpdate(this.store);
  }
}
