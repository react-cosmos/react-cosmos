import * as React from 'react';
import retry from '@skidding/async-retry';
import { render, waitForElement, fireEvent } from 'react-testing-library';
import { Slot, loadPlugins, MethodHandlers } from 'react-plugin';
import { cleanup, mockMethodsOf } from '../../testHelpers/plugin';
import {
  mockStorage,
  mockCore,
  mockRendererCore
} from '../../testHelpers/pluginMocks';
import { RouterSpec } from '../Router/public';
import { register } from '.';

afterEach(cleanup);

const fixtures = { 'ein.js': null, 'zwei.js': null, 'drei.js': null };

function registerTestPlugins() {
  register();
  mockStorage({
    getItem: () => {},
    setItem: () => {}
  });
  mockCore({
    getFixtureFileVars: () => ({
      fixturesDir: 'fixtures',
      fixtureFileSuffix: 'fixture'
    })
  });
  mockRendererCore({
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
    getSelectedFixtureId: () => null
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
