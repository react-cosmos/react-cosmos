import matchComponentFixture from '../match-component-fixture';

const m = (fixturePath, componentCleanPath, expectedFixtureCleanPath) => {
  expect(matchComponentFixture(fixturePath, componentCleanPath)).toBe(expectedFixtureCleanPath);
};

describe('Grouped inside components/__fixtures__', () => {
  test('matches root component with root fixture', () => {
    m('./__fixtures__/Menu/base.js', 'Menu', 'base');
  });

  test('matches nested component with root fixture', () => {
    m('./__fixtures__/Dashboard/Header/base.js', 'Dashboard/Header', 'base');
  });

  test('matches root component with nested fixture', () => {
    m('./__fixtures__/Menu/loggedIn/base.js', 'Menu', 'loggedIn/base');
  });

  test('matches root component with root fixture', () => {
    m('./__fixtures__/Dashboard/Header/loggedIn/base.js', 'Dashboard/Header', 'loggedIn/base');
  });

  test('does not match component without namespace', () => {
    m('./__fixtures__/Dashboard/Header/base.js', 'Header', false);
  });

  test('does not confuse uppercase component for fixture', () => {
    m('./__fixtures__/Dashboard/Header/base.js', 'Dashboard', false);
  });
});

describe('Nested inside ${COMPONENT_PATH}/__fixtures__', () => {
  test('matches root component with root fixture', () => {
    m('./Menu/__fixtures__/base.js', 'Menu', 'base');
  });

  test('matches nested component with root fixture', () => {
    m('./Dashboard/Header/__fixtures__/base.js', 'Dashboard/Header', 'base');
  });

  test('matches root component with nested fixture', () => {
    m('./Menu/__fixtures__/loggedIn/base.js', 'Menu', 'loggedIn/base');
  });

  test('matches root component with root fixture', () => {
    m('./Dashboard/Header/__fixtures__/loggedIn/base.js', 'Dashboard/Header', 'loggedIn/base');
  });

  test('does not match component without namespace', () => {
    m('./Dashboard/Header/__fixtures__/base.js', 'Header', false);
  });

  test('does not confuse uppercase component for fixture', () => {
    m('./Dashboard/Header/__fixtures__/base.js', 'Dashboard', false);
  });
});

describe('Grouped inside custom dir', () => {
  test('matches root component with root fixture', () => {
    m('./Menu/base.js', 'Menu', 'base');
  });

  test('matches nested component with root fixture', () => {
    m('./Dashboard/Header/base.js', 'Dashboard/Header', 'base');
  });

  test('matches root component with nested fixture', () => {
    m('./Menu/loggedIn/base.js', 'Menu', 'loggedIn/base');
  });

  test('matches root component with root fixture', () => {
    m('./Dashboard/Header/loggedIn/base.js', 'Dashboard/Header', 'loggedIn/base');
  });

  test('does not match component without namespace', () => {
    m('./Dashboard/Header/base.js', 'Header', false);
  });

  test('does not confuse uppercase component for fixture', () => {
    m('./Dashboard/Header/base.js', 'Dashboard', false);
  });
});
