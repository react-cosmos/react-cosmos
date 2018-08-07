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

export function createFixture<P: {}, F: FixtureType<P>>(fixture: F): F {
  return fixture;
}
