import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { FixtureList } from 'react-cosmos-core';
import { loadPlugins, resetPlugins } from 'react-plugin';
import { NavPanelRowSlot } from '../../slots/NavPanelRowSlot.js';
import {
  mockCore,
  mockRendererCore,
  mockRoot,
  mockRouter,
  mockStorage,
} from '../../testHelpers/pluginMocks.js';
import { register } from './index.js';

beforeEach(register);

afterEach(resetPlugins);

const fixtures: FixtureList = {
  'ein.js': { type: 'single' },
  'zwei.js': { type: 'single' },
  'drei.js': { type: 'single' },
};

function registerTestPlugins() {
  mockStorage();
  mockCore({
    getFixtureFileVars: () => ({
      fixturesDir: 'fixtures',
      fixtureFileSuffix: 'fixture',
    }),
  });
  mockRoot();
}

async function loadTestPlugins() {
  loadPlugins();
  return render(
    <NavPanelRowSlot slotProps={{ onCloseNavPanel: () => {} }} plugOrder={[]} />
  );
}

it('renders fixture list from renderer state', async () => {
  registerTestPlugins();
  mockRouter({
    getSelectedFixtureId: () => null,
  });
  mockRendererCore({
    isRendererConnected: () => true,
    getFixtures: () => fixtures,
  });

  const { findByText } = await loadTestPlugins();
  await findByText(/ein/i);
  await findByText(/zwei/i);
  await findByText(/drei/i);
});

it('sends fixtureId to router on fixture click', async () => {
  registerTestPlugins();
  const { selectFixture } = mockRouter({
    getSelectedFixtureId: () => null,
  });
  mockRendererCore({
    isRendererConnected: () => true,
    getFixtures: () => fixtures,
  });

  const { getByText } = await loadTestPlugins();
  fireEvent.click(getByText(/zwei/i));

  expect(selectFixture).toBeCalledWith(expect.any(Object), { path: 'zwei.js' });
});

it('renders blank state', async () => {
  registerTestPlugins();
  mockRouter({
    getSelectedFixtureId: () => null,
  });
  mockRendererCore({
    isRendererConnected: () => true,
    getFixtures: () => ({}),
  });

  const { findByText } = await loadTestPlugins();
  await findByText(/no component/i);
  await findByText(/fixtures found/i);
  await findByText(/place fixture files under/i);
});
