import * as React from 'react';
import { render, waitForElement, wait } from 'react-testing-library';
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
    isFullScreen: () => true
  });
  register();
}

function loadTestPlugins() {
  loadPlugins();
  return render(<Slot name="root" />);
}

it('does not render "left" slot', async () => {
  registerTestPlugins();
  mockPlug('left', () => <>we are the robots</>);

  const { queryByText } = loadTestPlugins();
  await wait(() => expect(queryByText(/we are the robots/i)).toBeNull());
});

it('does not render "rendererHeader" slot', async () => {
  registerTestPlugins();
  mockPlug('rendererHeader', () => <>we are the robots</>);

  const { queryByText } = loadTestPlugins();
  await wait(() => expect(queryByText(/we are the robots/i)).toBeNull());
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

it('does not render "right" slot', async () => {
  registerTestPlugins();
  mockPlug('right', () => <>we are the robots</>);

  const { queryByText } = loadTestPlugins();
  await wait(() => expect(queryByText(/we are the robots/i)).toBeNull());
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
