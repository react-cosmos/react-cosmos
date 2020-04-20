import { render } from '@testing-library/react';
import React from 'react';
import { loadPlugins, resetPlugins, Slot } from 'react-plugin';
import { register } from '..';
import {
  mockRendererCore,
  mockStorage,
} from '../../../testHelpers/pluginMocks';

afterEach(resetPlugins);

const fixtureState = {
  viewport: { width: 420, height: 420 },
};

function registerTestPlugins() {
  register();
  mockStorage();
  mockRendererCore({
    getFixtureState: () => fixtureState,
    isValidFixtureSelected: () => true,
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
  getByTestId('responsiveHeader');
});
