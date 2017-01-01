import matchFixturePath from '../match-fixture-path';

const m = (fixturePath, componentCleanPath, expectedFixtureCleanPath) => {
  expect(matchFixturePath(fixturePath, componentCleanPath)).toBe(expectedFixtureCleanPath);
};

const testExtension = (ext) => {
  describe(`.${ext}`, () => {
    describe('Grouped inside components/__fixtures__', () => {
      test('matches root component with root fixture', () => {
        m(`./__fixtures__/Menu/base.${ext}`, 'Menu', 'base');
      });

      test('matches namespaced component with root fixture', () => {
        m(`./__fixtures__/Dashboard/Header/base.${ext}`, 'Dashboard/Header', 'base');
      });

      test('matches root component with namespaced fixture', () => {
        m(`./__fixtures__/Menu/loggedIn/base.${ext}`, 'Menu', 'loggedIn/base');
      });

      test('matches root component with root fixture', () => {
        m(`./__fixtures__/Dashboard/Header/loggedIn/base.${ext}`,
          'Dashboard/Header', 'loggedIn/base');
      });

      test('does not match component without namespace', () => {
        m(`./__fixtures__/Dashboard/Header/base.${ext}`, 'Header', false);
      });
    });

    describe('Nested inside COMPONENT_PATH/__fixtures__', () => {
      test('matches root component with root fixture', () => {
        m(`./Menu/__fixtures__/base.${ext}`, 'Menu', 'base');
      });

      test('matches namespaced component with root fixture', () => {
        m(`./Dashboard/Header/__fixtures__/base.${ext}`, 'Dashboard/Header', 'base');
      });

      test('matches root component with namespaced fixture', () => {
        m(`./Menu/__fixtures__/loggedIn/base.${ext}`, 'Menu', 'loggedIn/base');
      });

      test('matches root component with root fixture', () => {
        m(`./Dashboard/Header/__fixtures__/loggedIn/base.${ext}`,
          'Dashboard/Header', 'loggedIn/base');
      });

      test('does not match component without namespace', () => {
        m(`./Dashboard/Header/__fixtures__/base.${ext}`, 'Header', false);
      });
    });

    describe('Grouped inside custom dir', () => {
      test('matches root component with root fixture', () => {
        m(`./Menu/base.${ext}`, 'Menu', 'base');
      });

      test('matches namespaced component with root fixture', () => {
        m(`./Dashboard/Header/base.${ext}`, 'Dashboard/Header', 'base');
      });

      test('matches root component with namespaced fixture', () => {
        m(`./Menu/loggedIn/base.${ext}`, 'Menu', 'loggedIn/base');
      });

      test('matches root component with root fixture', () => {
        m(`./Dashboard/Header/loggedIn/base.${ext}`, 'Dashboard/Header', 'loggedIn/base');
      });

      test('does not match component without namespace', () => {
        m(`./Dashboard/Header/base.${ext}`, 'Header', false);
      });
    });
  });
};

testExtension('js');
testExtension('json');
