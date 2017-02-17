import fs from 'fs';

jest.unmock('fs');

describe('static directory', () => {
  test('has index.html', () => {
    expect(fs.existsSync(require.resolve('../static/index.html'))).toBe(true);
  });

  test('has favicon', () => {
    expect(fs.existsSync(require.resolve('../static/favicon.ico'))).toBe(true);
  });
});
