import * as React from 'react';
import { render } from 'react-testing-library';
import { loadPlugins, Slot } from 'react-plugin';
import { cleanup, mockMethodsOf } from '../../../testHelpers/plugin';
import { RouterSpec } from '../../Router/public';
import { RendererCoordinatorSpec } from '../../RendererCoordinator/public';
import { RendererPreviewSpec } from '../../RendererPreview/public';
import { register } from '..';

afterEach(cleanup);

function registerTestPlugins() {
  register();
  mockMethodsOf<RouterSpec>('router', {
    getUrlParams: () => ({ fixturePath: 'foo.js' })
  });
  mockMethodsOf<RendererCoordinatorSpec>('rendererCoordinator', {
    isRendererConnected: () => true,
    isValidFixtureSelected: () => true
  });
  mockMethodsOf<RendererPreviewSpec>('rendererPreview', {
    getUrlStatus: () => 'ok',
    getRuntimeStatus: () => 'connected'
  });
}

function loadTestPlugins() {
  loadPlugins();

  return render(<Slot name="contentOverlay" />);
}

it('does not render anything', () => {
  registerTestPlugins();
  const { container } = loadTestPlugins();

  expect(container).toMatchInlineSnapshot(`<div />`);
});
