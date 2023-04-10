import { render } from '@testing-library/react';
import React from 'react';
import { loadPlugins, resetPlugins, Slot } from 'react-plugin';
import { register } from '..';
import {
  mockRendererCore,
  mockRendererPreview,
  mockRouter,
  mockStorage,
} from '../../../testHelpers/pluginMocks.js';

beforeEach(register);

afterEach(resetPlugins);

function registerTestPlugins() {
  mockStorage();
  mockRouter({
    getSelectedFixtureId: () => null,
  });
  mockRendererCore({
    isRendererConnected: () => false,
    isValidFixtureSelected: () => false,
  });
  mockRendererPreview({
    getUrlStatus: () => 'error',
    getRuntimeStatus: () => 'pending',
  });
}

function loadTestPlugins() {
  loadPlugins();
  return render(<Slot name="contentOverlay" />);
}

it('renders "error" message', () => {
  registerTestPlugins();
  const { getByText } = loadTestPlugins();

  getByText(/renderer/i);
  getByText(/not responding/i);
});

it('renders "help" link', () => {
  registerTestPlugins();
  const { getByText } = loadTestPlugins();

  const helpLink = getByText(/ask for help/i) as HTMLAnchorElement;
  expect(helpLink.href).toMatch('https://discord.gg/3X95VgfnW5');
});
