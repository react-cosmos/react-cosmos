// @flow

import React from 'react';
import { Slot } from 'react-plugin';
import { UiContext } from '../../../context';
import { ResponsivePreview } from './ResponsivePreview';
import { storeViewportInBrowserHistory } from '../shared';

import type { Node } from 'react';
import type { UiContextParams } from '../../../context';

type Props = {
  children: Node
};

export function PreviewSlot({ children }: Props) {
  return (
    <Slot name="preview">
      <UiContext.Consumer>
        {({ options, state, onFixtureEdit }: UiContextParams) => {
          if (options.platform !== 'web') {
            return children;
          }

          const { responsiveDevices } = options;
          const { fixtureBody } = state;

          // TODO: Remove "|| []"
          return (
            <ResponsivePreview
              devices={responsiveDevices || []}
              viewport={fixtureBody.viewport}
              onViewportChange={viewport => {
                onFixtureEdit({
                  ...fixtureBody,
                  viewport
                });
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
