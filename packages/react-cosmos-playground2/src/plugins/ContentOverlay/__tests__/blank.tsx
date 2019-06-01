import * as React from 'react';
import { render } from 'react-testing-library';
import { loadPlugins, Slot } from 'react-plugin';
import { cleanup } from '../../../testHelpers/plugin';
import {
  mockRouter,
  mockRendererCore,
  mockRendererPreview
} from '../../../testHelpers/pluginMocks';
import { register } from '..';

afterEach(cleanup);

function registerTestPlugins() {
  register();
  mockRouter({
    getSelectedFixtureId: () => null
  });
  mockRendererCore({
    isRendererConnected: () => true,
    isValidFixtureSelected: () => false
  });
  mockRendererPreview({
    getUrlStatus: () => 'ok',
    getRuntimeStatus: () => 'connected'
  });
}

function loadTestPlugins() {
  loadPlugins();
  return render(<Slot name="contentOverlay" />);
}

it('renders "blank" state', () => {
  registerTestPlugins();
  const { queryByTestId } = loadTestPlugins();
  expect(queryByTestId('blank')).not.toBeNull();
});
