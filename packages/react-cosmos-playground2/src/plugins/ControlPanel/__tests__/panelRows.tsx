import React from 'react';
import { render } from '@testing-library/react';
import { Slot, loadPlugins } from 'react-plugin';
import { cleanup, mockPlug } from '../../../testHelpers/plugin';
import { mockLayout } from '../../../testHelpers/pluginMocks';
import { register } from '..';

afterEach(cleanup);

function loadTestPlugins() {
  loadPlugins();
  return render(<Slot name="panel" />);
}

function mockPanelRow(rowMock: string) {
  mockPlug('controlPanelRow', () => <>{rowMock}</>);
}

it('renders control panel rows when panel is open', async () => {
  register();
  mockLayout({
    isPanelOpen: () => true
  });
  mockPanelRow('mockRow');

  const { getByText } = loadTestPlugins();
  getByText('mockRow');
});

it('does not render control panel rows when panel is closed', async () => {
  register();
  mockLayout({
    isPanelOpen: () => false
  });
  mockPanelRow('mockRow');

  const { queryByText } = loadTestPlugins();
  expect(queryByText('mockRow')).toBeNull();
});
