// @flow

import type { Node, ComponentType } from 'react';
import type { ComponentRef } from './react';

export type FixtureType<P: {}> = {
  component: ComponentType<P>,
  name?: string,
  namespace?: string,
  props?: P,
  children?: Node, // Deprecated in favor of props.children
  init?: ({ compRef: ?ComponentRef }) => Promise<any>
};

export function createFixture<P: {}>(fixture: FixtureType<P>) {
  return fixture;
}
