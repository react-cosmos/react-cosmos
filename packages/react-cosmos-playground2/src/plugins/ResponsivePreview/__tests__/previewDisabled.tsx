import * as React from 'react';
import { render } from 'react-testing-library';
import { loadPlugins, Slot } from 'react-plugin';
import { cleanup, mockMethodsOf } from '../../../testHelpers/plugin';
import { StorageSpec } from '../../Storage/public';
import { RouterSpec } from '../../Router/public';
import { CoreSpec } from '../../Core/public';
import { RendererCoreSpec } from '../../RendererCore/public';
import { register } from '..';

afterEach(cleanup);

function registerTestPlugins() {
  register();
  mockMethodsOf<StorageSpec>('storage', {});
  mockMethodsOf<CoreSpec>('core', {
    getProjectId: () => 'mockProjectId'
  });
  mockMethodsOf<RouterSpec>('router', {
    getUrlParams: () => ({ fixturePath: 'foo.js' })
  });
  mockMethodsOf<RendererCoreSpec>('rendererCore', {
    getFixtureState: () => null,
    isValidFixtureSelected: () => false
  });
}

function loadTestPlugins() {
  loadPlugins({
    state: { responsivePreview: { enabled: false, viewport: null } }
  });

  return render(
    <Slot name="rendererPreviewOuter">
      <div data-testid="previewMock" />
    </Slot>
  );
}

it('renders children of "rendererPreviewOuter" slot', () => {
  registerTestPlugins();

  const { getByTestId } = loadTestPlugins();
  getByTestId('previewMock');
});

it('does not render responsive header', () => {
  registerTestPlugins();

  const { queryByTestId } = loadTestPlugins();
  expect(queryByTestId('responsiveHeader')).toBeNull();
});
