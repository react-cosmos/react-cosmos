import { fireEvent, render, waitForElement } from '@testing-library/react';
import React from 'react';
import { loadPlugins, Slot } from 'react-plugin';
import { register } from '.';
import { cleanup } from '../../testHelpers/plugin';
import {
  mockCore,
  mockRendererCore,
  mockRouter,
  mockStorage
} from '../../testHelpers/pluginMocks';

afterEach(cleanup);

const fixtures = { 'ein.js': null, 'zwei.js': null, 'drei.js': null };

function registerTestPlugins() {
  register();
  mockStorage();
  mockCore({
    getFixtureFileVars: () => ({
      fixturesDir: 'fixtures',
      fixtureFileSuffix: 'fixture'
    })
  });
}

async function loadTestPlugins() {
  loadPlugins();
  return render(<Slot name="navRow" />);
}

it('renders fixture list from renderer state', async () => {
  registerTestPlugins();
  mockRouter({
    getSelectedFixtureId: () => null
  });
  mockRendererCore({
    isRendererConnected: () => true,
    getFixtures: () => fixtures
  });

  const { getByText } = await loadTestPlugins();
  await waitForElement(() => getByText(/ein/i));
  await waitForElement(() => getByText(/zwei/i));
  await waitForElement(() => getByText(/drei/i));
});

it('sends fixtureId to router on fixture click', async () => {
  registerTestPlugins();
  const { selectFixture } = mockRouter({
    getSelectedFixtureId: () => null
  });
  mockRendererCore({
    isRendererConnected: () => true,
    getFixtures: () => fixtures
  });

  const { getByText } = await loadTestPlugins();
  fireEvent.click(getByText(/zwei/i));

  expect(selectFixture).toBeCalledWith(
    expect.any(Object),
    { path: 'zwei.js', name: null },
    false
  );
});

it('renders blank state', async () => {
  registerTestPlugins();
  mockRouter({
    getSelectedFixtureId: () => null
  });
  mockRendererCore({
    isRendererConnected: () => true,
    getFixtures: () => ({})
  });

  const { getByTestId } = await loadTestPlugins();
  getByTestId('nav-blank-state');
});
