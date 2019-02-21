import * as React from 'react';
import delay from 'delay';
import { render, waitForElement, fireEvent } from 'react-testing-library';
import { Slot, loadPlugins, MethodHandlers } from 'react-plugin';
import { cleanup, mockMethodsOf } from '../../testHelpers/plugin';
import { StorageSpec } from '../Storage/public';
import { RouterSpec } from '../Router/public';
import { CoreSpec } from '../Core/public';
import { RendererCoreSpec } from '../RendererCore/public';
import { register } from '.';

afterEach(cleanup);

const fixtures = { 'ein.js': null, 'zwei.js': null, 'drei.js': null };

function registerTestPlugins() {
  register();
  mockMethodsOf<StorageSpec>('storage', {
    getItem: () => Promise.resolve(null),
    setItem: () => Promise.resolve(undefined)
  });
  mockMethodsOf<CoreSpec>('core', {
    getProjectId: () => 'mockProjectId',
    getFixtureFileVars: () => ({
      fixturesDir: 'fixtures',
      fixtureFileSuffix: 'fixture'
    })
  });
  mockMethodsOf<RendererCoreSpec>('rendererCore', {
    isRendererConnected: () => true,
    getFixtures: () => fixtures
  });
}

function mockRouter(methods: Partial<MethodHandlers<RouterSpec>> = {}) {
  mockMethodsOf<RouterSpec>('router', methods);
}

function loadTestPlugins() {
  loadPlugins();

  return render(<Slot name="left" />);
}

it('renders fixture list from renderer state', async () => {
  registerTestPlugins();
  mockRouter({
    getSelectedFixtureId: () => null,
    isFullScreen: () => false
  });
  const { getByText } = loadTestPlugins();

  await waitForElement(() => getByText(/ein/i));
  await waitForElement(() => getByText(/zwei/i));
  await waitForElement(() => getByText(/drei/i));
});

it('sends fixtureId to router on fixture click', async () => {
  registerTestPlugins();

  const selectFixture = jest.fn();
  mockRouter({
    getSelectedFixtureId: () => null,
    isFullScreen: () => false,
    selectFixture
  });

  const { getByText } = loadTestPlugins();
  fireEvent.click(getByText(/zwei/i));

  expect(selectFixture).toBeCalledWith(
    expect.any(Object),
    { path: 'zwei.js', name: null },
    false
  );
});

// This test confirms the existence of the "nav" element under normal
// conditions, and thus the validity of the "full screen" test
it('renders nav element', async () => {
  registerTestPlugins();
  mockRouter({
    getSelectedFixtureId: () => null,
    isFullScreen: () => false
  });
  const { getByTestId } = loadTestPlugins();

  await waitForElement(() => getByTestId('nav'));
});

it('does not render nav element in full screen mode', async () => {
  registerTestPlugins();
  mockRouter({
    getSelectedFixtureId: () => ({ path: 'zwei.js', name: null }),
    isFullScreen: () => true
  });
  const { queryByTestId } = loadTestPlugins();

  // Make sure the nav element doesn't appear async in the next event loops
  await delay(100);

  expect(queryByTestId('nav')).toBeNull();
});
