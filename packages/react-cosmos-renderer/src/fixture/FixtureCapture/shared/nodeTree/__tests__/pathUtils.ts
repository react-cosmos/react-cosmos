import { getByPath, setByPath } from '../pathUtils.js';

describe('getByPath', () => {
  it('gets a simple property', () => {
    expect(getByPath({ a: 1 }, 'a')).toBe(1);
  });

  it('gets a nested property', () => {
    expect(getByPath({ a: { b: 2 } }, 'a.b')).toBe(2);
  });

  it('gets an array index', () => {
    expect(getByPath({ items: [10, 20, 30] }, 'items[1]')).toBe(20);
  });

  it('gets a deeply nested path with mixed notation', () => {
    const obj = { props: { children: [{ props: { children: 'hello' } }] } };
    expect(getByPath(obj, 'props.children[0].props.children')).toBe('hello');
  });

  it('returns undefined for missing path', () => {
    expect(getByPath({ a: 1 }, 'b')).toBeUndefined();
  });

  it('returns undefined for path through null', () => {
    expect(getByPath({ a: null }, 'a.b')).toBeUndefined();
  });
});

describe('setByPath', () => {
  it('sets a simple property', () => {
    const obj = { a: 1 };
    setByPath(obj, 'a', 2);
    expect(obj.a).toBe(2);
  });

  it('sets a nested property', () => {
    const obj = { a: { b: 1 } };
    setByPath(obj, 'a.b', 2);
    expect(obj.a.b).toBe(2);
  });

  it('sets an array element by index', () => {
    const obj = { items: [10, 20, 30] };
    setByPath(obj, 'items[1]', 99);
    expect(obj.items[1]).toBe(99);
  });

  it('sets a deeply nested path with mixed notation', () => {
    const obj = { props: { children: [{ value: 'old' }] } };
    setByPath(obj, 'props.children[0].value', 'new');
    expect(obj.props.children[0].value).toBe('new');
  });

  it('returns the original object', () => {
    const obj = { a: 1 };
    expect(setByPath(obj, 'a', 2)).toBe(obj);
  });
});
