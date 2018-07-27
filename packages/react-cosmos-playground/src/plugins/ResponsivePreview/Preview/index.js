// @flow

import React from 'react';
import { Slot } from 'react-plugin';
import { UiContext } from '../../../context';
import { ResponsivePreview } from './ResponsivePreview';
import {
  getPluginConfig,
  getPluginState,
  setPluginState,
  getFixtureViewport,
  storeViewportInBrowserHistory
} from '../shared';

import type { Node } from 'react';
import type { UiContextParams } from '../../../context';
import type { Viewport } from '../types';

type Props = {
  children: Node
};

export function PreviewSlot({ children }: Props) {
  return (
    <Slot name="preview">
      <UiContext.Consumer>
        {(uiContext: UiContextParams) => {
          const { options, state, editFixture } = uiContext;

          if (options.platform !== 'web') {
            return children;
          }

          const { devices } = getPluginConfig(uiContext);
          const pluginState = getPluginState(uiContext);
          const fixtureViewport = getFixtureViewport(uiContext);

          return (
            <ResponsivePreview
              devices={devices}
              pluginState={pluginState}
              fixtureViewport={fixtureViewport}
              onViewportChange={(viewport: Viewport) => {
                editFixture({
                  ...state.fixtureBody,
                  viewport
                });

                setPluginState(
                  uiContext,
                  pluginState.enabled
                    ? { enabled: true, viewport }
                    : { enabled: false, viewport }
                );

                storeViewportInBrowserHistory(viewport);
              }}
            >
              {children}
            </ResponsivePreview>
          );
        }}
      </UiContext.Consumer>
    </Slot>
  );
}
