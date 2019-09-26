import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Slot, loadPlugins, resetPlugins } from 'react-plugin';
import { mockLayout } from '../../../testHelpers/pluginMocks';
import { register } from '..';

afterEach(resetPlugins);

function loadTestPlugins() {
  loadPlugins();
  return render(<Slot name="rendererAction" />);
}

it('opens panel', async () => {
  register();
  const { openPanel } = mockLayout({
    isPanelOpen: () => false
  });

  const { getByTitle } = loadTestPlugins();
  const btn = getByTitle(/open control panel/i);
  fireEvent.click(btn);

  expect(openPanel).toBeCalledWith(expect.any(Object), true);
});

it('toggles panel', async () => {
  register();
  const { openPanel } = mockLayout({
    isPanelOpen: () => true
  });

  const { getByTitle } = loadTestPlugins();
  const btn = getByTitle(/open control panel/i);
  fireEvent.click(btn);

  expect(openPanel).lastCalledWith(expect.any(Object), false);
});
