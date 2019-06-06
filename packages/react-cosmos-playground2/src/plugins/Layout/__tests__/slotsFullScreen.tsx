import React from 'react';
import { render, waitForElement } from '@testing-library/react';
import { Slot, loadPlugins } from 'react-plugin';
import { cleanup, mockPlug } from '../../../testHelpers/plugin';
import {
  mockStorage,
  mockRouter,
  mockCore,
  mockRendererCore
} from '../../../testHelpers/pluginMocks';
import { register } from '..';

afterEach(cleanup);

function registerTestPlugins() {
  mockStorage({
    loadCache: () => Promise.resolve(null)
  });
  mockRouter({
    isFullScreen: () => true
  });
  mockCore();
  mockRendererCore({
    isValidFixtureSelected: () => true
  });
  register();
}

async function loadTestPlugins() {
  loadPlugins();
  const utils = render(<Slot name="root" />);
  await waitForElement(() => utils.getByTestId('layout'));
  return utils;
}

it('does not render "nav" slot', async () => {
  registerTestPlugins();
  mockPlug('nav', () => <>we are the robots</>);

  const { queryByText } = await loadTestPlugins();
  expect(queryByText(/we are the robots/i)).toBeNull();
});

it('does not render "rendererHeader" slot', async () => {
  registerTestPlugins();
  mockPlug('rendererHeader', () => <>we are the robots</>);

  const { queryByText } = await loadTestPlugins();
  expect(queryByText(/we are the robots/i)).toBeNull();
});

it('renders "rendererPreview" slot', async () => {
  registerTestPlugins();
  mockPlug('rendererPreview', () => <>we are the robots</>);

  const { getByText } = await loadTestPlugins();
  getByText(/we are the robots/i);
});

it('renders "contentOverlay" slot', async () => {
  registerTestPlugins();
  mockPlug('contentOverlay', () => <>we are the robots</>);

  const { getByText } = await loadTestPlugins();
  getByText(/we are the robots/i);
});

it('renders "previewGlobal" slot', async () => {
  registerTestPlugins();
  mockPlug('previewGlobal', () => <>we are the robots1</>);
  mockPlug('previewGlobal', () => <>we are the robots2</>);

  const { getByText } = await loadTestPlugins();
  getByText(/we are the robots1/i);
  getByText(/we are the robots2/i);
});

it('does not render "panel" slot', async () => {
  registerTestPlugins();
  mockPlug('panel', () => <>we are the robots</>);

  const { queryByText } = await loadTestPlugins();
  expect(queryByText(/we are the robots/i)).toBeNull();
});

it('renders "global" plugs', async () => {
  mockPlug('global', () => <>first</>);
  mockPlug('global', () => <>second</>);
  mockPlug('global', () => <>third</>);
  registerTestPlugins();

  const { getByText } = await loadTestPlugins();
  getByText(/first/i);
  getByText(/second/i);
  getByText(/third/i);
});
