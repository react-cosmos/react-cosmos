import * as React from 'react';
import { render } from 'react-testing-library';
import { loadPlugins, Slot } from 'react-plugin';
import { cleanup, mockMethodsOf } from '../../../testHelpers/plugin2';
import { RouterSpec } from '../../Router/public';
import { RendererCoordinatorSpec } from '../../RendererCoordinator/public';
import { RendererPreviewSpec } from '../../RendererPreview/public';
import { register } from '..';

afterEach(cleanup);

function registerTestPlugins() {
  register();
  mockMethodsOf<RouterSpec>('router', {
    getUrlParams: () => ({})
  });
  mockMethodsOf<RendererCoordinatorSpec>('rendererCoordinator', {
    isRendererConnected: () => false,
    isValidFixtureSelected: () => false
  });
  mockMethodsOf<RendererPreviewSpec>('rendererPreview', {
    getUrlStatus: () => 'error',
    getRuntimeStatus: () => 'pending'
  });
}

function loadTestPlugins() {
  loadPlugins();

  return render(<Slot name="contentOverlay" />);
}

it('renders "error" message', () => {
  registerTestPlugins();
  const { getByText } = loadTestPlugins();

  getByText(/renderer not responding/i);
});

it('renders "help" link', () => {
  registerTestPlugins();
  const { getByText } = loadTestPlugins();

  const helpLink = getByText(/ask for help/i) as HTMLAnchorElement;
  expect(helpLink.href).toMatch('https://join-react-cosmos.now.sh');
});
