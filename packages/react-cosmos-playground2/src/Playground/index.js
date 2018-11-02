// @flow

import React from 'react';
import { Slot } from 'react-plugin';
import { PlaygroundProvider } from '../PlaygroundProvider';

import type { PlaygroundOptions } from '../index.js.flow';

type Props = {
  options: PlaygroundOptions
};

export function Playground({ options }: Props) {
  return (
    <PlaygroundProvider options={options}>
      <Slot name="preview" />
    </PlaygroundProvider>
  );
}
