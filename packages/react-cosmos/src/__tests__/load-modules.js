/* eslint-disable no-console */

import { loadComponents, loadFixtures } from '../load-modules';

let consoleWarn;

beforeEach(() => {
  consoleWarn = console.warn;
  console.warn = jest.fn();
});

afterEach(() => {
  console.warn = consoleWarn;
});

describe('loading components', () => {
  test('returns empty object when none', () => {
    expect(loadComponents({})).toEqual({});
  });

  test('returns CommonJS export', () => {
    const MyComponent = () => {};
    expect(loadComponents({
      MyComponent: () => MyComponent,
    }).MyComponent).toBe(MyComponent);
  });

  test('returns ES6 default export', () => {
    const MyComponent = () => {};
    expect(loadComponents({
      MyComponent: () => ({ __esModule: true, default: MyComponent }),
    }).MyComponent).toBe(MyComponent);
  });

  test('returns ES6 named export', () => {
    const MyComponent = () => {};
    expect(loadComponents({
      MyComponent: () => ({ __esModule: true, MyComponent }),
    }).MyComponent).toBe(MyComponent);
  });

  test('does not crash on exploding module', () => {
    expect(() => {
      loadComponents({
        MyComponent: () => {
          throw new Error('BOOM!');
        },
      });
    }).not.toThrow();
    expect(console.warn).toHaveBeenCalled();
  });
});

describe('loading fixtures', () => {
  test('returns empty object when none', () => {
    expect(loadFixtures({})).toEqual({});
  });

  test('returns CommonJS export', () => {
    const fixture = { foo: 'bar' };
    expect(loadFixtures({
      MyComponent: {
        blank: () => fixture,
      },
    }).MyComponent.blank).toBe(fixture);
  });

  test('returns ES6 default export', () => {
    const fixture = { foo: 'bar' };
    expect(loadFixtures({
      MyComponent: {
        blank: () => ({ __esModule: true, default: fixture }),
      },
    }).MyComponent.blank).toBe(fixture);
  });

  test('does not crash on exploding module', () => {
    expect(() => {
      loadFixtures({
        MyComponent: {
          blank: () => {
            throw new Error('BOOM!');
          },
        },
      });
    }).not.toThrow();
    expect(console.warn).toHaveBeenCalled();
  });

  test('returns default fixture when component has none', () => {
    expect(loadFixtures({
      MyComponent: {},
    }).MyComponent['no props (auto)']).toEqual({});
  });
});
