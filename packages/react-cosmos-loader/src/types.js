// @flow

import { Component } from 'react';

import type { Element, ComponentType, ElementRef } from 'react';

export type ComponentRef = ElementRef<typeof Component>;

export type Wrapper = {
  unmount: () => any
};

export type Renderer = (element: Element<any>) => Wrapper;

export type ContextFunctions = {
  getRef: () => ?ComponentRef,
  getWrapper: () => ?Wrapper,
  get: (fixtureKey?: string) => any,
  mount: (clearPrevInstance?: boolean) => Promise<any>,
  unmount: () => any
};

export type Fixture = {
  component: ComponentType<any>,
  init?: ({ compRef: ?ComponentRef }) => Promise<any>
};

export type Proxy = ComponentType<any>;

export type Fixtures = {
  [componentName: string]: {
    [fixtureName: string]: Fixture
  }
};

export type FixtureNames = {
  [componentName: string]: Array<string>
};
