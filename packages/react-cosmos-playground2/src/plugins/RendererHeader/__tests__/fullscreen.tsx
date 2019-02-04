import * as React from 'react';
import delay from 'delay';
import { render } from 'react-testing-library';
import { Slot, loadPlugins } from 'react-plugin';
import { cleanup, mockMethods, mockPlug } from '../../../testHelpers/plugin2';
import { RouterSpec } from '../../Router/public';
import { RendererCoordinatorSpec } from '../../RendererCoordinator/public';
import { register } from '..';

afterEach(cleanup);

function registerTestPlugins() {
  register();
  mockMethods<RouterSpec>('router', {
    getUrlParams: () => ({ fixturePath: 'foo', fullScreen: true })
  });
  mockMethods<RendererCoordinatorSpec>('rendererCoordinator', {
    isRendererConnected: () => false,
    isValidFixtureSelected: () => true
  });
}

function loadTestPlugins() {
  loadPlugins();

  return render(<Slot name="rendererHeader" />);
}

it('does not render close button', async () => {
  registerTestPlugins();
  mockPlug({ slotName: 'fixtureActions', render: 'pluggable actions' });
  const { queryByText } = loadTestPlugins();

  // Make sure the element doesn't appear async in the next event loops
  await delay(100);
  expect(queryByText(/close/i)).toBeNull();
});

it('does not render "fixtureActions" slot', async () => {
  registerTestPlugins();
  mockPlug({ slotName: 'fixtureActions', render: 'pluggable actions' });
  const { queryByText } = loadTestPlugins();

  // Make sure the element doesn't appear async in the next event loops
  await delay(100);
  expect(queryByText(/pluggable actions/i)).toBeNull();
});
