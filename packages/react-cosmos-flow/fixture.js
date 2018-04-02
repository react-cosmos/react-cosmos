// @flow

import type { Node, ComponentType } from 'react';

import type { ComponentRef } from './react';

export type FixtureType<P: {}, C: ComponentType<P>> = {
  component: C,
  name?: string,
  namespace?: string,
  props?: P,
  children?: Node, // Deprecated in favor of props.children
  init?: ({ compRef: ?ComponentRef }) => Promise<any>
};

export function createFixture<P: {}, C: ComponentType<P>>(
  fixture: FixtureType<P, C>
) {
  return fixture;
}
