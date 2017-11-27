// @flow

import { Component } from 'react';

import type { Element, ComponentType, ElementRef } from 'react';

export type ComponentRef = ElementRef<typeof Component>;

export type Wrapper = {
  unmount: () => any
};

export type Renderer = (element: Element<any>) => Wrapper;

type GetRef = () => ?ComponentRef;

export type ContextFunctions = {
  getRef: GetRef,
  getWrapper: () => ?Wrapper,
  get: (fixtureKey?: string) => any,
  update: (fixturePart: {}) => any,
  mount: () => Promise<any>,
  unmount: () => any
};

export type Fixture = {
  component: ComponentType<any>,
  init?: ({ getRef: GetRef }) => Promise<any>
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
