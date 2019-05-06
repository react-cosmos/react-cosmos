import * as React from 'react';
import { render, waitForElement, wait } from 'react-testing-library';
import { Slot, loadPlugins } from 'react-plugin';
import { createArrayPlug } from '../../../shared/slot';
import { cleanup, mockPlug } from '../../../testHelpers/plugin';
import { mockStorage, mockRouter } from '../../../testHelpers/pluginMocks';
import { register } from '..';

afterEach(cleanup);

function registerTestPlugins() {
  mockStorage({
    loadCache: () => Promise.resolve(null),
    getItem: () => {}
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

function createGlobalPlug(element: React.ReactElement<any>) {
  mockPlug({
    slotName: 'global',
    render: createArrayPlug('global', () => element)
  });
}

it('does not render "left" slot', async () => {
  registerTestPlugins();
  mockPlug({ slotName: 'left', render: 'we are the robots' });

  const { queryByText } = loadTestPlugins();
  await wait(() => expect(queryByText(/we are the robots/i)).toBeNull());
});

it('does not render "rendererHeader" slot', async () => {
  registerTestPlugins();
  mockPlug({ slotName: 'rendererHeader', render: 'we are the robots' });

  const { queryByText } = loadTestPlugins();
  await wait(() => expect(queryByText(/we are the robots/i)).toBeNull());
});

it('renders "rendererPreview" slot', async () => {
  registerTestPlugins();
  mockPlug({ slotName: 'rendererPreview', render: 'we are the robots' });

  const { getByText } = loadTestPlugins();
  await waitForElement(() => getByText(/we are the robots/i));
});

it('renders "contentOverlay" slot', async () => {
  registerTestPlugins();
  mockPlug({ slotName: 'contentOverlay', render: 'we are the robots' });

  const { getByText } = loadTestPlugins();
  await waitForElement(() => getByText(/we are the robots/i));
});

it('does not render "right" slot', async () => {
  registerTestPlugins();
  mockPlug({ slotName: 'right', render: 'we are the robots' });

  const { queryByText } = loadTestPlugins();
  await wait(() => expect(queryByText(/we are the robots/i)).toBeNull());
});

it('renders "global" plugs', async () => {
  createGlobalPlug(<>first</>);
  createGlobalPlug(<>second</>);
  createGlobalPlug(<>third</>);
  registerTestPlugins();

  const { getByText } = loadTestPlugins();
  await waitForElement(() => getByText(/first/i));
  await waitForElement(() => getByText(/second/i));
  await waitForElement(() => getByText(/third/i));
});
