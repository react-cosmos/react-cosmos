const mockModules = {};
const createContext = (fileMap) => {
  // Useful for matchFixturePath mock
  Object.assign(mockModules, fileMap);

  const fn = path => fileMap[path];
  fn.keys = () => Object.keys(fileMap);
  return fn;
};

const Welcome = {};
const DashboardHeader = {};
const Onboarding = {};

/* eslint-disable camelcase */
const Welcome_base = {
  componentCleanPath: 'Welcome',
  name: 'base',
};
const DashboardHeader_base = {
  componentCleanPath: 'Dashboard/Header',
  name: 'base',
};
const DashboardHeader_loggedIn = {
  componentCleanPath: 'Dashboard/Header',
  name: 'loggedIn',
};
const Onboarding_base = {
  componentCleanPath: 'Onboarding',
  name: 'base',
};
/* eslint-enable camelcase */

jest.mock('../match-fixture-path', () => (fixturePath, componentCleanPath) => {
  const fixture = mockModules[fixturePath];
  return fixture.componentCleanPath !== componentCleanPath ? false : fixture.name;
});

const expandModulePaths = require('../expand-module-paths').default;

const mockComponentContext1 = createContext({
  './Welcome.jsx': Welcome,
  './Dashboard/Header.js': DashboardHeader,
  './Banned.js': {},
  // These must be ignored
  './__fixtures__/Welcome/base.js': Welcome_base,
  './__fixtures__/Dashboard/Header/base.js': DashboardHeader_base,
  './__fixtures__/Dashboard/Header/loggedIn.js': DashboardHeader_loggedIn,
});

const mockComponentContext2 = createContext({
  './Onboarding/Onboarding.jsx': Onboarding,
});

const mockFixtureContext1 = createContext({
  './__fixtures__/Welcome/base.js': Welcome_base,
  './__fixtures__/Dashboard/Header/base.js': DashboardHeader_base,
  './__fixtures__/Dashboard/Header/loggedIn.js': DashboardHeader_loggedIn,
});

const mockFixtureContext2 = createContext({
  './Onboarding/base.js': Onboarding_base,
});

jest.mock('../get-contexts', () => ({
  getComponentContexts: () => [
    mockComponentContext1,
    mockComponentContext2,
  ],
  getFixtureContexts: () => [
    mockFixtureContext1,
    mockFixtureContext2,
  ],
}));

let components;
let fixtures;

beforeAll(() => {
  ({ components, fixtures } = expandModulePaths([
    /Ban/,
  ]));
});

test('root component is extracted', () => {
  expect(components.Welcome).toBe(Welcome);
});

test('namespaced component is extracted', () => {
  expect(components['Dashboard/Header']).toBe(DashboardHeader);
});

test('nested component is normalized', () => {
  expect(components.Onboarding).toBe(Onboarding);
});

test('ignored components are not matched', () => {
  expect(components.Banned).toBe(undefined);
});

test('fixtures are ignored from component contexts', () => {
  expect(Object.keys(components).length).toBe(3);
});

test('fixtures for root component are extracted', () => {
  expect(fixtures.Welcome.base).toBe(Welcome_base);
});

test('fixtures for namespaced component are extracted', () => {
  expect(fixtures['Dashboard/Header'].base).toBe(DashboardHeader_base);
  expect(fixtures['Dashboard/Header'].loggedIn).toBe(DashboardHeader_loggedIn);
});

test('fixtures from 2nd context are extracted', () => {
  expect(fixtures.Onboarding.base).toBe(Onboarding_base);
});
