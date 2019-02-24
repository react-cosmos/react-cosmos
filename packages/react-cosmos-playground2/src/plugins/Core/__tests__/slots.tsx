import * as React from 'react';
import { render, waitForElement } from 'react-testing-library';
import { Slot, loadPlugins } from 'react-plugin';
import { createArrayPlug } from '../../../shared/slot';
import { cleanup, mockPlug } from '../../../testHelpers/plugin';
import { register } from '..';

afterEach(cleanup);

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

it('renders "left" slot', async () => {
  register();
  mockPlug({ slotName: 'left', render: 'we are the robots' });
  const { getByText } = loadTestPlugins();

  await waitForElement(() => getByText(/we are the robots/i));
});

it('renders "rendererHeader" slot', async () => {
  register();
  mockPlug({ slotName: 'rendererHeader', render: 'we are the robots' });
  const { getByText } = loadTestPlugins();

  await waitForElement(() => getByText(/we are the robots/i));
});

it('renders "rendererPreview" slot', async () => {
  register();
  mockPlug({ slotName: 'rendererPreview', render: 'we are the robots' });
  const { getByText } = loadTestPlugins();

  await waitForElement(() => getByText(/we are the robots/i));
});

it('renders "contentOverlay" slot', async () => {
  register();
  mockPlug({ slotName: 'contentOverlay', render: 'we are the robots' });
  const { getByText } = loadTestPlugins();

  await waitForElement(() => getByText(/we are the robots/i));
});

it('renders "right" slot', async () => {
  register();
  mockPlug({ slotName: 'right', render: 'we are the robots' });
  const { getByText } = loadTestPlugins();

  await waitForElement(() => getByText(/we are the robots/i));
});

it('renders "global" plugs', async () => {
  register();

  createGlobalPlug(<>first</>);
  createGlobalPlug(<>second</>);
  createGlobalPlug(<>third</>);
  const { getByText } = loadTestPlugins();

  await waitForElement(() => getByText(/first/i));
  await waitForElement(() => getByText(/second/i));
  await waitForElement(() => getByText(/third/i));
});
