// @flow

import type { Element } from 'react';
import type { FixtureType } from './fixture';
import type { Proxy } from './proxy';
import type { ComponentRef } from './react';

export type Wrapper = {
  unmount: () => any
};

export type Renderer = (element: Element<any>, options?: Object) => Wrapper;

export type ContextArgs = {
  renderer: Renderer,
  rendererOptions?: Object,
  proxies?: Array<Proxy>,
  fixture: FixtureType<*, *>,
  onUpdate?: (fixturePart: {}) => any,
  beforeInit?: () => Promise<any>
};

export type ContextFunctions = {
  getRef: () => ComponentRef,
  getWrapper: () => Wrapper,
  getField: (fixtureKey?: string) => any,
  get: (fixtureKey?: string) => any,
  mount: (clearPrevInstance?: boolean) => Promise<any>,
  unmount: () => any
};

export type TestContextArgs = ContextArgs & {
  cosmosConfigPath?: string
};

export type EnzymeContextArgs = $Diff<TestContextArgs, { renderer: Renderer }>;
