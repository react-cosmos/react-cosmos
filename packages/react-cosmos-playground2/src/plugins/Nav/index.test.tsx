import * as React from 'react';
import retry from '@skidding/async-retry';
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

async function loadTestPlugins() {
  loadPlugins();
  const renderer = render(<Slot name="left">replace me</Slot>);
  await retry(() => expect(renderer.queryByText('replace me')).toBeNull());
  return renderer;
}

it('renders fixture list from renderer state', async () => {
  registerTestPlugins();
  mockRouter({
    getSelectedFixtureId: () => null,
    isFullScreen: () => false
  });
  const { getByText } = await loadTestPlugins();
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

  const { getByText } = await loadTestPlugins();
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
  const { getByTestId } = await loadTestPlugins();
  await waitForElement(() => getByTestId('nav'));
});

it('does not render nav element in full screen mode', async () => {
  registerTestPlugins();
  mockRouter({
    getSelectedFixtureId: () => ({ path: 'zwei.js', name: null }),
    isFullScreen: () => true
  });
  const { queryByTestId } = await loadTestPlugins();
  expect(queryByTestId('nav')).toBeNull();
});
