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
  await retry(() => expect(renderer.queryByText('replace me')).toBeNull());
  return renderer;
}

const RENDERER_ACTION = 'foo action';
function mockRendererAction() {
  mockPlug({ slotName: 'rendererActions', render: RENDERER_ACTION });
}

const FIXTURE_ACTION = 'bar action';
function mockFixtureAction() {
  mockPlug({ slotName: 'fixtureActions', render: FIXTURE_ACTION });
}

it('does not render close button', async () => {
  registerTestPlugins();
  const { queryByText } = await loadTestPlugins();
  expect(queryByText(/close/i)).toBeNull();
});

it('does not render renderer actions', async () => {
  registerTestPlugins();
  mockRendererAction();
  const { queryByText } = await loadTestPlugins();
  expect(queryByText(RENDERER_ACTION)).toBeNull();
});

it('does not render fixture actions', async () => {
  registerTestPlugins();
  mockFixtureAction();
  const { queryByText } = await loadTestPlugins();
  expect(queryByText(FIXTURE_ACTION)).toBeNull();
});
