import { render } from '@testing-library/react';
import React from 'react';
import { loadPlugins, Slot } from 'react-plugin';
import { register } from '..';
import { cleanup, mockPlug } from '../../../testHelpers/plugin';
import { mockRendererCore } from '../../../testHelpers/pluginMocks';

afterEach(cleanup);

function loadTestPlugins() {
  loadPlugins();
  return render(<Slot name="nav" />);
}

function mockNavRow(rowMock: React.ReactNode) {
  mockPlug('navRow', () => <>{rowMock}</>);
}

it('renders nav rows', async () => {
  register();
  mockRendererCore({
    isRendererConnected: () => true
  });
  mockNavRow(<span>mockRow1</span>);
  mockNavRow(<span>mockRow2</span>);

  const { getByText } = loadTestPlugins();
  getByText('mockRow1');
  getByText('mockRow2');
});

it('does not render nav rows when renderer is not connected', async () => {
  register();
  mockRendererCore({
    isRendererConnected: () => false
  });
  mockNavRow(<span>mockRow1</span>);

  const { queryByText } = loadTestPlugins();
  expect(queryByText('mockRow1')).toBeNull();
});
