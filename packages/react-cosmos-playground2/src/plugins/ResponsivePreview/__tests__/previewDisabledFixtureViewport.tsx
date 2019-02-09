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

const fixtureState = {
  components: [],
  viewport: { width: 420, height: 420 }
};

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
    getFixtureState: () => fixtureState,
    isValidFixtureSelected: () => true
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

it('renders responsive header', () => {
  registerTestPlugins();

  const { getByTestId } = loadTestPlugins();
  getByTestId('responsiveHeader');
});
