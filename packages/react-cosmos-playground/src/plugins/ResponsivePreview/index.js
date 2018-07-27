// @flow

import React from 'react';
import { Plugin, Plug, Slot } from 'react-plugin';
import { UiContext } from '../../context';
import { HeaderButton } from './HeaderButton';
import { Preview } from './Preview';

import type { Node } from 'react';
import type { UiContextParams } from '../../context';

export default (
  <Plugin name="Responsive Preview">
    <Plug slot="header-buttons" render={HeaderButtonsSlot} />
    <Plug slot="preview" render={PreviewSlot} />
  </Plugin>
);

type SlotProps = {
  children: Node
};

function HeaderButtonsSlot({ children }: SlotProps) {
  return (
    <Slot name="header-buttons">
      <UiContext.Consumer>
        {(uiContext: UiContextParams) => (
          <HeaderButton uiContext={uiContext}>{children}</HeaderButton>
        )}
      </UiContext.Consumer>
    </Slot>
  );
}

function PreviewSlot({ children }: SlotProps) {
  return (
    <Slot name="preview">
      <UiContext.Consumer>
        {(uiContext: UiContextParams) => (
          <Preview uiContext={uiContext}>{children}</Preview>
        )}
      </UiContext.Consumer>
    </Slot>
  );
}
