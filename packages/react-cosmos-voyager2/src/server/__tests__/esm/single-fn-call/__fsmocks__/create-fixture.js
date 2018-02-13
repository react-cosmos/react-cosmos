// @flow

import type { Node, ComponentType } from 'react';

export function createFixture<P: {}, C: ComponentType<P>>(fixture: {
  component: C,
  name?: string,
  props?: P,
  children?: Node
}) {
  return fixture;
}
