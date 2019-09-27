import { render } from '@testing-library/react';
import React from 'react';
import { loadPlugins, resetPlugins } from 'react-plugin';
import { register } from '..';
import { ControlPanelRowSlotProps } from '../../../shared/slots/ControlPanelRowSlot';
import { RendererPanelSlot } from '../../../shared/slots/RendererPanelSlot';
import { mockPlug } from '../../../testHelpers/plugin';
import { mockLayout, mockRendererCore } from '../../../testHelpers/pluginMocks';

afterEach(resetPlugins);

function loadTestPlugins() {
  loadPlugins();
  return render(
    <RendererPanelSlot
      slotProps={{ fixtureId: { path: 'foo.js', name: null } }}
    />
  );
}

function mockPanelRow() {
  mockPlug<ControlPanelRowSlotProps>('controlPanelRow', ({ slotProps }) => (
    <>{slotProps.fixtureId.path}</>
  ));
}

it('renders control panel rows when panel is open', async () => {
  register();
  mockRendererCore();
  mockLayout({ isPanelOpen: () => true });
  mockPanelRow();

  const { getByText } = loadTestPlugins();
  getByText('foo.js');
});

it('does not render control panel rows when panel is closed', async () => {
  register();
  mockRendererCore();
  mockLayout({ isPanelOpen: () => false });
  mockPanelRow();

  const { queryByText } = loadTestPlugins();
  expect(queryByText('foo.js')).toBeNull();
});
