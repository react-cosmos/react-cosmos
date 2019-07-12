import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Slot, loadPlugins } from 'react-plugin';
import { cleanup } from '../../../testHelpers/plugin';
import { mockLayout, mockRendererCore } from '../../../testHelpers/pluginMocks';
import { register } from '..';

afterEach(cleanup);

function loadTestPlugins() {
  loadPlugins();
  return render(<Slot name="rendererAction" />);
}

it('renders disabled button when no valid fixture is selected', async () => {
  register();
  mockLayout();
  mockRendererCore({
    isValidFixtureSelected: () => false
  });

  const { getByTitle } = loadTestPlugins();
  expect(getByTitle(/open control panel/i)).toHaveAttribute('disabled');
});

it('opens panel', async () => {
  register();
  const { openPanel } = mockLayout({
    isPanelOpen: () => false
  });
  mockRendererCore({
    isValidFixtureSelected: () => true
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
  mockRendererCore({
    isValidFixtureSelected: () => true
  });

  const { getByTitle } = loadTestPlugins();
  const btn = getByTitle(/open control panel/i);
  fireEvent.click(btn);

  expect(openPanel).lastCalledWith(expect.any(Object), false);
});
