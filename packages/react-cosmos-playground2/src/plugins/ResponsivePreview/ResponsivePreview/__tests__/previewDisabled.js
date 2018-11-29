// @flow

import React from 'react';
import { render, cleanup } from 'react-testing-library';
import { Slot } from 'react-plugin';
import { PluginProvider } from '../../../../plugin';
import { SetPluginState } from '../../../../testHelpers/SetPluginState';

// Plugins have side-effects: they register themselves
// "renderer" and "router" states are required for the ResponsivePreview plugin
// to work
import '../../../Renderer';
import '../../../Router';
import '../..';

afterEach(cleanup);

it('renders children of "rendererPreviewOuter" slot', () => {
  const { getByTestId } = renderPlayground();

  getByTestId('preview-mock');
});

it('does not render responsive header', () => {
  const { queryByTestId } = renderPlayground(
    <SetPluginState
      pluginName="router"
      value={{ urlParams: { fixturePath: 'fooFixture.js' } }}
    />
  );

  expect(queryByTestId('responsive-header')).toBeNull();
});

it('renders responsive header when fixture has viewport', () => {
  const { getByTestId } = renderPlayground(
    <>
      <SetPluginState
        pluginName="router"
        value={{ urlParams: { fixturePath: 'fooFixture.js' } }}
      />
      <SetPluginState
        pluginName="renderer"
        value={{
          primaryRendererId: 'fooRendererId',
          renderers: {
            fooRendererId: {
              fixtures: ['fooFixture.js'],
              fixtureState: {
                viewport: { width: 420, height: 420 }
              }
            }
          }
        }}
      />
    </>
  );

  getByTestId('responsive-header');
});

function renderPlayground(otherNodes) {
  return render(
    <PluginProvider config={{ renderer: { webUrl: 'mockRendererUrl' } }}>
      {otherNodes}
      <Slot name="rendererPreviewOuter">
        <div data-testid="preview-mock" />
      </Slot>
      <SetPluginState
        pluginName="responsive-preview"
        value={{ enabled: false, viewport: null }}
      />
    </PluginProvider>
  );
}
