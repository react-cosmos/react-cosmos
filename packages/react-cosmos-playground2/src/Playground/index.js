// @flow

import React from 'react';
import { Slot } from 'react-plugin';
import { PlaygroundProvider } from '../PlaygroundProvider';

import type { PlaygroundOptions } from '../index.js.flow';

type Props = {
  options: PlaygroundOptions
};

export function Playground({ options }: Props) {
  // TODO: Replace "preview" slot with something else for non-web environments
  return (
    <PlaygroundProvider options={options}>
      <Slot name="root">
        <Slot name="preview" />
      </Slot>
    </PlaygroundProvider>
  );
}
