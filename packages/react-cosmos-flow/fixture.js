// @flow

import type { Node, ComponentType, ElementRef } from 'react';

export type FixtureType<P: {}> = {
  component: ComponentType<P>,
  name?: string,
  namespace?: string,
  props?: P,
  children?: Node, // Deprecated in favor of props.children
  init?: ({ compRef: ?ElementRef<ComponentType<P>> }) => Promise<any>
};

// Deprecated. Use this instead:
//  import { createFixture } from 'react-cosmos'
export function createFixture<P: {}, F: FixtureType<P>>(fixture: F) {
  return fixture;
}
