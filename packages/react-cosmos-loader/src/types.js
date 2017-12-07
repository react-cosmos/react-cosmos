// @flow

import { Component } from 'react';

import type { Element, ComponentType, ElementRef } from 'react';

export type ComponentRef = ElementRef<typeof Component>;

export type Fixture = {
  component: ComponentType<any>,
  init?: ({ compRef: ?ComponentRef }) => Promise<any>
};

export type Proxy = ComponentType<any>;

export type Wrapper = {
  unmount: () => any
};

export type Renderer = (element: Element<any>, options?: Object) => Wrapper;

export type ContextArgs = {
  renderer: Renderer,
  rendererOptions?: Object,
  proxies?: Array<Proxy>,
  fixture: Fixture,
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

export type Fixtures = {
  [componentName: string]: {
    [fixtureName: string]: Fixture
  }
};

export type FixtureNames = {
  [componentName: string]: Array<string>
};
