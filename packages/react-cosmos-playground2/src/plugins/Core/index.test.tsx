import * as React from 'react';
import { render, waitForElement } from 'react-testing-library';
import { Slot, loadPlugins } from 'react-plugin';
import { cleanup, mockPlug } from '../../testHelpers/plugin';
import { register } from '.';

afterEach(cleanup);

function registerTestPlugins(slotName: string) {
  register();
  mockPlug({ slotName, render: 'we are the robots' });
}

function loadTestPlugins() {
  loadPlugins();

  return render(<Slot name="root" />);
}

it('renders "left" slot', async () => {
  registerTestPlugins('left');
  const { getByText } = loadTestPlugins();

  await waitForElement(() => getByText(/we are the robots/i));
});

it('renders "rendererHeader" slot', async () => {
  registerTestPlugins('rendererHeader');
  const { getByText } = loadTestPlugins();

  await waitForElement(() => getByText(/we are the robots/i));
});

it('renders "rendererPreview" slot', async () => {
  registerTestPlugins('rendererPreview');
  const { getByText } = loadTestPlugins();

  await waitForElement(() => getByText(/we are the robots/i));
});

it('renders "contentOverlay" slot', async () => {
  registerTestPlugins('contentOverlay');
  const { getByText } = loadTestPlugins();

  await waitForElement(() => getByText(/we are the robots/i));
});

it('renders "right" slot', async () => {
  registerTestPlugins('right');
  const { getByText } = loadTestPlugins();

  await waitForElement(() => getByText(/we are the robots/i));
});
