import { render } from '@testing-library/react';
import React from 'react';
import {
  mockRendererCore,
  mockRendererPreview,
  mockRouter,
  mockStorage,
} from 'react-cosmos-shared2/ui';
import { loadPlugins, resetPlugins, Slot } from 'react-plugin';

beforeEach(() => jest.isolateModules(() => require('..')));

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
  expect(helpLink.href).toMatch(
    'https://react-cosmos.slack.com/join/shared_invite/zt-g9rsalqq-clCoV7DWttVvzO5FAAmVAw'
  );
});
