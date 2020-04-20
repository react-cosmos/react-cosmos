import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { loadPlugins, resetPlugins } from 'react-plugin';
import { register } from '.';
import { NavRowSlot } from '../../shared/slots/NavRowSlot';
import {
  mockCore,
  mockRendererCore,
  mockRouter,
  mockStorage,
} from '../../testHelpers/pluginMocks';

afterEach(resetPlugins);

const fixtures = { 'ein.js': null, 'zwei.js': null, 'drei.js': null };

function registerTestPlugins() {
  register();
  mockStorage();
  mockCore({
    getFixtureFileVars: () => ({
      fixturesDir: 'fixtures',
      fixtureFileSuffix: 'fixture',
    }),
  });
}

async function loadTestPlugins() {
  loadPlugins();
  return render(
    <NavRowSlot slotProps={{ onCloseNav: () => {} }} plugOrder={[]} />
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

  expect(selectFixture).toBeCalledWith(expect.any(Object), {
    path: 'zwei.js',
    name: null,
  });
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

  const { getByTestId } = await loadTestPlugins();
  getByTestId('nav-blank-state');
});
