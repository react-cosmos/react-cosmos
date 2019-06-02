import React from 'react';
import { render, waitForElement } from 'react-testing-library';
import { Slot, loadPlugins } from 'react-plugin';
import { cleanup, mockPlug } from '../../../testHelpers/plugin';
import { mockStorage, mockRouter } from '../../../testHelpers/pluginMocks';
import { register } from '..';

afterEach(cleanup);

function registerTestPlugins() {
  mockStorage({
    loadCache: () => Promise.resolve(null)
  });
  mockRouter({
    isFullScreen: () => false
  });
  register();
}

function loadTestPlugins() {
  loadPlugins();
  return render(<Slot name="root" />);
}

it('renders "left" slot', async () => {
  registerTestPlugins();
  mockPlug('left', () => <>we are the robots</>);

  const { getByText } = loadTestPlugins();
  await waitForElement(() => getByText(/we are the robots/i));
});

it('renders "rendererHeader" slot', async () => {
  registerTestPlugins();
  mockPlug('rendererHeader', () => <>we are the robots</>);

  const { getByText } = loadTestPlugins();
  await waitForElement(() => getByText(/we are the robots/i));
});

it('renders "rendererPreview" slot', async () => {
  registerTestPlugins();
  mockPlug('rendererPreview', () => <>we are the robots</>);

  const { getByText } = loadTestPlugins();
  await waitForElement(() => getByText(/we are the robots/i));
});

it('renders "contentOverlay" slot', async () => {
  registerTestPlugins();
  mockPlug('contentOverlay', () => <>we are the robots</>);

  const { getByText } = loadTestPlugins();
  await waitForElement(() => getByText(/we are the robots/i));
});

it('renders "previewGlobal" slot', async () => {
  registerTestPlugins();
  mockPlug('previewGlobal', () => <>we are the robots1</>);
  mockPlug('previewGlobal', () => <>we are the robots2</>);

  const { getByText } = loadTestPlugins();
  await waitForElement(() => getByText(/we are the robots1/i));
  await waitForElement(() => getByText(/we are the robots2/i));
});

it('renders "right" slot', async () => {
  registerTestPlugins();
  mockPlug('right', () => <>we are the robots</>);

  const { getByText } = loadTestPlugins();
  await waitForElement(() => getByText(/we are the robots/i));
});

it('renders "global" plugs', async () => {
  mockPlug('global', () => <>first</>);
  mockPlug('global', () => <>second</>);
  mockPlug('global', () => <>third</>);
  registerTestPlugins();

  const { getByText } = loadTestPlugins();
  await waitForElement(() => getByText(/first/i));
  await waitForElement(() => getByText(/second/i));
  await waitForElement(() => getByText(/third/i));
});
