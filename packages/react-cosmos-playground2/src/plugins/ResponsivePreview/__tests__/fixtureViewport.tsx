import { render } from '@testing-library/react';
import React from 'react';
import { mockRendererCore, mockStorage } from 'react-cosmos-shared2/ui';
import { loadPlugins, resetPlugins, Slot } from 'react-plugin';

beforeEach(() => jest.isolateModules(() => require('..')));

afterEach(resetPlugins);

const fixtureState = {
  viewport: { width: 420, height: 420 },
};

function registerTestPlugins() {
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
