// @flow

import React from 'react';
import { render, cleanup, waitForElement } from 'react-testing-library';
import { Slot, resetPlugins, registerPlugin, loadPlugins } from 'react-plugin';
import { register } from '.';

afterEach(() => {
  cleanup();
  resetPlugins();
});

it('renders left Slot', async () => {
  const { getByText } = loadTestPlugins(() => {
    registerTestPlug({
      slotName: 'left',
      render: 'we are the robots'
    });
  });

  await waitForElement(() => getByText(/we are the robots/i));
});

it('renders rendererPreview Slot', async () => {
  const { getByText } = loadTestPlugins(() => {
    registerTestPlug({
      slotName: 'rendererPreview',
      render: 'we are the robots'
    });
  });

  await waitForElement(() => getByText(/we are the robots/i));
});

it('renders right Slot', async () => {
  const { getByText } = loadTestPlugins(() => {
    registerTestPlug({
      slotName: 'right',
      render: 'we are the robots'
    });
  });

  await waitForElement(() => getByText(/we are the robots/i));
});

function loadTestPlugins(extraSetup = () => {}) {
  register();
  extraSetup();
  loadPlugins();

  return render(<Slot name="root" />);
}

function registerTestPlug({
  slotName,
  render
}: {
  slotName: string,
  render: string
}) {
  registerPlugin({ name: 'test' }).plug({
    slotName,
    render
  });
}
