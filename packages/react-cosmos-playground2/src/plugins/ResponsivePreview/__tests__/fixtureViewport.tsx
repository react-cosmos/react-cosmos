import * as React from 'react';
import { render, waitForElement } from 'react-testing-library';
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
    isFullScreen: () => false
  });
  mockMethodsOf<RendererCoreSpec>('rendererCore', {
    getFixtureState: () => fixtureState,
    isValidFixtureSelected: () => true
  });
}

function loadTestPlugins() {
  loadPlugins();

  return render(
    <Slot name="rendererPreviewOuter">
      <div data-testid="previewMock" />
    </Slot>
  );
}

it('renders responsive header', async () => {
  registerTestPlugins();

  const { getByTestId } = loadTestPlugins();
  await waitForElement(() => getByTestId('responsiveHeader'));
});
