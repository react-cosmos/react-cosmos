import { isEqual } from './isEqual.js';

describe('primitives', () => {
  it('treats identical strings as equal', () => {
    expect(isEqual('a', 'a')).toBe(true);
  });

  it('treats different strings as unequal', () => {
    expect(isEqual('a', 'b')).toBe(false);
  });

  it('treats identical numbers as equal', () => {
    expect(isEqual(42, 42)).toBe(true);
  });

  it('treats different numbers as unequal', () => {
    expect(isEqual(1, 2)).toBe(false);
  });

  it('treats NaN as equal to NaN', () => {
    expect(isEqual(NaN, NaN)).toBe(true);
  });

  it('treats +0 and -0 as equal', () => {
    expect(isEqual(+0, -0)).toBe(true);
  });

  it('treats booleans as equal', () => {
    expect(isEqual(true, true)).toBe(true);
    expect(isEqual(false, false)).toBe(true);
    expect(isEqual(true, false)).toBe(false);
  });

  it('treats null as equal to null', () => {
    expect(isEqual(null, null)).toBe(true);
  });

  it('treats undefined as equal to undefined', () => {
    expect(isEqual(undefined, undefined)).toBe(true);
  });

  it('treats null and undefined as unequal', () => {
    expect(isEqual(null, undefined)).toBe(false);
  });

  it('treats number and string with same text as unequal', () => {
    expect(isEqual(1, '1')).toBe(false);
  });

  it('treats null and empty object as unequal', () => {
    expect(isEqual(null, {})).toBe(false);
    expect(isEqual({}, null)).toBe(false);
  });
});

describe('arrays', () => {
  it('treats empty arrays as equal', () => {
    expect(isEqual([], [])).toBe(true);
  });

  it('treats arrays with same contents as equal', () => {
    expect(isEqual([1, 2, 3], [1, 2, 3])).toBe(true);
  });

  it('treats arrays with different contents as unequal', () => {
    expect(isEqual([1, 2, 3], [1, 2, 4])).toBe(false);
  });

  it('treats arrays of different lengths as unequal', () => {
    expect(isEqual([1, 2], [1, 2, 3])).toBe(false);
  });

  it('compares nested arrays structurally', () => {
    expect(isEqual([[1, 2], [3]], [[1, 2], [3]])).toBe(true);
    expect(isEqual([[1, 2], [3]], [[1, 2], [4]])).toBe(false);
  });

  it('treats array and plain object as unequal', () => {
    expect(isEqual([1, 2], { 0: 1, 1: 2, length: 2 })).toBe(false);
    expect(isEqual({ 0: 1, 1: 2 }, [1, 2])).toBe(false);
  });
});

describe('plain objects', () => {
  it('treats empty objects as equal', () => {
    expect(isEqual({}, {})).toBe(true);
  });

  it('treats objects with same keys and values as equal', () => {
    expect(isEqual({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
  });

  it('ignores key order', () => {
    expect(isEqual({ a: 1, b: 2 }, { b: 2, a: 1 })).toBe(true);
  });

  it('treats objects with different keys as unequal', () => {
    expect(isEqual({ a: 1 }, { b: 1 })).toBe(false);
  });

  it('treats objects with different values as unequal', () => {
    expect(isEqual({ a: 1 }, { a: 2 })).toBe(false);
  });

  it('treats objects with missing keys as unequal', () => {
    expect(isEqual({ a: 1 }, { a: 1, b: 2 })).toBe(false);
  });

  it('treats undefined value as different from missing key', () => {
    expect(isEqual({ a: undefined }, {})).toBe(false);
  });

  it('compares nested objects structurally', () => {
    expect(isEqual({ a: { b: { c: 1 } } }, { a: { b: { c: 1 } } })).toBe(true);
    expect(isEqual({ a: { b: { c: 1 } } }, { a: { b: { c: 2 } } })).toBe(false);
  });

  it('compares mixed nested structures', () => {
    const a = { items: [{ id: 1 }, { id: 2 }], meta: { count: 2 } };
    const b = { items: [{ id: 1 }, { id: 2 }], meta: { count: 2 } };
    expect(isEqual(a, b)).toBe(true);
  });
});

describe('dates', () => {
  it('treats dates with same time as equal', () => {
    expect(isEqual(new Date(2024, 0, 1), new Date(2024, 0, 1))).toBe(true);
  });

  it('treats dates with different times as unequal', () => {
    expect(isEqual(new Date(2024, 0, 1), new Date(2024, 0, 2))).toBe(false);
  });

  it('treats a date and a plain object as unequal', () => {
    expect(isEqual(new Date(), {})).toBe(false);
    expect(isEqual({}, new Date())).toBe(false);
  });
});

describe('regexps', () => {
  it('treats regexps with same source and flags as equal', () => {
    expect(isEqual(/abc/g, /abc/g)).toBe(true);
  });

  it('treats regexps with different sources as unequal', () => {
    expect(isEqual(/abc/, /abd/)).toBe(false);
  });

  it('treats regexps with different flags as unequal', () => {
    expect(isEqual(/abc/g, /abc/i)).toBe(false);
  });

  it('treats a regexp and a plain object as unequal', () => {
    expect(isEqual(/abc/, {})).toBe(false);
    expect(isEqual({}, /abc/)).toBe(false);
  });
});

describe('maps', () => {
  it('treats empty maps as equal', () => {
    expect(isEqual(new Map(), new Map())).toBe(true);
  });

  it('treats maps with same entries as equal', () => {
    const a = new Map<string, number>([
      ['a', 1],
      ['b', 2],
    ]);
    const b = new Map<string, number>([
      ['a', 1],
      ['b', 2],
    ]);
    expect(isEqual(a, b)).toBe(true);
  });

  it('treats maps with different values as unequal', () => {
    const a = new Map([['a', 1]]);
    const b = new Map([['a', 2]]);
    expect(isEqual(a, b)).toBe(false);
  });

  it('treats maps of different sizes as unequal', () => {
    const a = new Map([['a', 1]]);
    const b = new Map([
      ['a', 1],
      ['b', 2],
    ]);
    expect(isEqual(a, b)).toBe(false);
  });

  it('treats a map and a plain object as unequal', () => {
    expect(isEqual(new Map(), {})).toBe(false);
    expect(isEqual({}, new Map())).toBe(false);
  });
});

describe('sets', () => {
  it('treats empty sets as equal', () => {
    expect(isEqual(new Set(), new Set())).toBe(true);
  });

  it('treats sets with same values as equal', () => {
    expect(isEqual(new Set([1, 2, 3]), new Set([1, 2, 3]))).toBe(true);
  });

  it('treats sets with different values as unequal', () => {
    expect(isEqual(new Set([1, 2]), new Set([1, 3]))).toBe(false);
  });

  it('treats sets of different sizes as unequal', () => {
    expect(isEqual(new Set([1]), new Set([1, 2]))).toBe(false);
  });

  it('treats a set and a plain object as unequal', () => {
    expect(isEqual(new Set(), {})).toBe(false);
    expect(isEqual({}, new Set())).toBe(false);
  });
});

describe('functions', () => {
  it('treats identical function references as equal', () => {
    const fn = () => 1;
    expect(isEqual(fn, fn)).toBe(true);
  });

  it('treats distinct function references as unequal', () => {
    expect(
      isEqual(
        () => 1,
        () => 1
      )
    ).toBe(false);
  });
});

describe('real-world fixture-like shapes', () => {
  it('treats matching fixtureId objects as equal', () => {
    expect(
      isEqual(
        { path: 'Button/fixture', name: null },
        { path: 'Button/fixture', name: null }
      )
    ).toBe(true);
  });

  it('treats fixtureIds differing by name as unequal', () => {
    expect(
      isEqual(
        { path: 'Button/fixture', name: null },
        { path: 'Button/fixture', name: 'primary' }
      )
    ).toBe(false);
  });

  it('treats matching elementIds as equal', () => {
    expect(
      isEqual(
        { decoratorId: 'd1', elPath: 'a.b.c' },
        { decoratorId: 'd1', elPath: 'a.b.c' }
      )
    ).toBe(true);
  });
});
