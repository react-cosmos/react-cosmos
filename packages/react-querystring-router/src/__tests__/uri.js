import uri from '../uri.js';

test('returns empty object when querystring is missing', () => {
  const uriLocation = 'mypage.com';
  const params = uri.parseLocation(uriLocation);

  expect(Object.keys(params).length).toBe(0);
});

test('returns empty object when querystring is empty', () => {
  const uriLocation = 'mypage.com?';
  const params = uri.parseLocation(uriLocation);

  expect(Object.keys(params).length).toBe(0);
});

test('parses stringified and encoded params from location', () => {
  const uriLocation = 'mypage.com?name=Jack&info=%7B%22age%22%3A25%7D';
  const params = uri.parseLocation(uriLocation);

  expect(params).toEqual({
    name: 'Jack',
    info: {
      age: 25,
    },
  });
});

test('generates location with query string from params', () => {
  const params = {
    name: 'Jack',
    info: {
      age: 25,
    },
  };

  expect(uri.stringifyParams(params))
      .toBe('?name=Jack&info=%7B%22age%22%3A25%7D');
});
