// @flow

import React from 'react';
import { Plugin, Plug, Slot } from 'react-plugin';
import { UiContext } from '../../context';
import { HeaderButton } from './HeaderButton';
import { Preview } from './Preview';

export default (
  <Plugin name="Responsive Preview">
    <Plug
      slot="header-buttons"
      render={({ children }) => (
        <Slot name="header-buttons">
          <UiContext.Consumer>
            {uiContext => (
              <HeaderButton uiContext={uiContext}>{children}</HeaderButton>
            )}
          </UiContext.Consumer>
        </Slot>
      )}
    />
    <Plug
      slot="preview"
      render={({ children }) => (
        <Slot name="preview">
          <UiContext.Consumer>
            {uiContext => <Preview uiContext={uiContext}>{children}</Preview>}
          </UiContext.Consumer>
        </Slot>
      )}
    />
  </Plugin>
);
