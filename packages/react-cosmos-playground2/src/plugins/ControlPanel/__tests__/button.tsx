import { fireEvent, render } from '@testing-library/react';
import React from 'react';
import { loadPlugins, resetPlugins } from 'react-plugin';
import { register } from '..';
import { RendererActionSlot } from '../../../shared/slots/RendererActionSlot';
import { mockLayout } from '../../../testHelpers/pluginMocks';

afterEach(resetPlugins);

function loadTestPlugins() {
  loadPlugins();
  return render(
    <RendererActionSlot
      slotProps={{ fixtureId: { path: 'foo.js', name: null } }}
      plugOrder={[]}
    />
  );
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
