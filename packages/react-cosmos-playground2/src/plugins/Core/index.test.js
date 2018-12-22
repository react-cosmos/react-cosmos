// @flow

import React from 'react';
import { render, waitForElement } from 'react-testing-library';
import { Slot, loadPlugins } from 'react-plugin';
import { cleanup, mockPlug } from '../../testHelpers/plugin';
import { register } from '.';

afterEach(cleanup);

function registerTestPlugins({ slotName, slotText }) {
  register();
  mockPlug({ slotName, render: slotText });
}

function loadTestPlugins() {
  loadPlugins();

  return render(<Slot name="root" />);
}

it('renders left slot', async () => {
  registerTestPlugins({
    slotName: 'left',
    slotText: 'we are the robots'
  });
  const { getByText } = loadTestPlugins();

  await waitForElement(() => getByText(/we are the robots/i));
});

it('renders fixtureActions slot', async () => {
  registerTestPlugins({
    slotName: 'fixtureActions',
    slotText: 'we are the robots'
  });
  const { getByText } = loadTestPlugins();

  await waitForElement(() => getByText(/we are the robots/i));
});

it('renders rendererPreview slot', async () => {
  registerTestPlugins({
    slotName: 'rendererPreview',
    slotText: 'we are the robots'
  });
  const { getByText } = loadTestPlugins();

  await waitForElement(() => getByText(/we are the robots/i));
});

it('renders right slot', async () => {
  registerTestPlugins({
    slotName: 'right',
    slotText: 'we are the robots'
  });
  const { getByText } = loadTestPlugins();

  await waitForElement(() => getByText(/we are the robots/i));
});
