import * as React from 'react';
import { render } from 'react-testing-library';
import retry from '@skidding/async-retry';
import { Slot, loadPlugins } from 'react-plugin';
import { cleanup, mockMethodsOf, mockPlug } from '../../../testHelpers/plugin';
import { RouterSpec } from '../../Router/public';
import { RendererCoreSpec } from '../../RendererCore/public';
import { register } from '..';

afterEach(cleanup);

function registerTestPlugins() {
  register();
  mockMethodsOf<RouterSpec>('router', {
    getSelectedFixtureId: () => ({ path: 'foo', name: null }),
    isFullScreen: () => true
  });
  mockMethodsOf<RendererCoreSpec>('rendererCore', {
    isRendererConnected: () => false,
    isValidFixtureSelected: () => true
  });
}

async function loadTestPlugins() {
  loadPlugins();
  const renderer = render(<Slot name="rendererHeader">replace me</Slot>);
  await retry(() => expect(renderer.queryByText(/replace me/i)).toBeNull());
  return renderer;
}

it('does not render close button', async () => {
  registerTestPlugins();
  mockPlug({ slotName: 'rendererActions', render: 'pluggable actions' });
  const { queryByText } = await loadTestPlugins();
  expect(queryByText(/close/i)).toBeNull();
});

it('does not render "rendererActions" slot', async () => {
  registerTestPlugins();
  mockPlug({ slotName: 'rendererActions', render: 'pluggable actions' });
  const { queryByText } = await loadTestPlugins();
  expect(queryByText(/pluggable actions/i)).toBeNull();
});
