import { render } from '@testing-library/react';
import React from 'react';
import { loadPlugins, resetPlugins } from 'react-plugin';
import { register } from '..';
import { NavSlot } from '../../../shared/slots/NavSlot';
import { mockPlug } from '../../../testHelpers/plugin';
import { mockRendererCore } from '../../../testHelpers/pluginMocks';

afterEach(resetPlugins);

function loadTestPlugins() {
  loadPlugins();
  return render(<NavSlot slotProps={{ onCloseNav: () => {} }} />);
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
