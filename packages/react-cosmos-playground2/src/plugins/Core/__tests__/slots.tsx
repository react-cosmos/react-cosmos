import * as React from 'react';
import { render, waitForElement } from 'react-testing-library';
import { Slot, loadPlugins } from 'react-plugin';
import { cleanup, mockPlug } from '../../../testHelpers/plugin';
import { createGlobalPlug } from '../public';
import { register } from '..';

afterEach(cleanup);

function loadTestPlugins() {
  loadPlugins();

  return render(<Slot name="root" />);
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

it('renders "global" plug', async () => {
  register();
  mockPlug({ slotName: 'global', render: createGlobalPlug(() => <>first</>) });
  mockPlug({ slotName: 'global', render: createGlobalPlug(() => <>second</>) });
  mockPlug({ slotName: 'global', render: createGlobalPlug(() => <>third</>) });
  const { getByText } = loadTestPlugins();

  await waitForElement(() => getByText(/first/i));
  await waitForElement(() => getByText(/second/i));
  await waitForElement(() => getByText(/third/i));
});
