// @flow

import type { FixtureNames } from './module';

export type LoaderWebOpts = {
  containerQuerySelector?: string
};

export type LoaderNativeOpts = {
  port: number
};

export type LoaderOpts = LoaderWebOpts | LoaderNativeOpts;

export type UiReadyMessage = {
  type: 'uiReady'
};

export type RuntimeErrorMessage = {
  type: 'runtimeError'
};

export type LoaderReadyMessage = {
  type: 'loaderReady',
  fixtures: FixtureNames
};

export type FixtureListUpdateMessage = {
  type: 'fixtureListUpdate',
  fixtures: FixtureNames
};

export type FixtureSelectMessage = {
  type: 'fixtureSelect',
  component: string,
  fixture: string
};

export type FixtureLoadMessage = {
  type: 'fixtureLoad',
  fixtureBody: Object
};

export type FixtureUpdateMessage = {
  type: 'fixtureUpdate',
  fixtureBody: Object
};

export type FixtureEditMessage = {
  type: 'fixtureEdit',
  fixtureBody: Object
};

export type LoaderMessage =
  | UiReadyMessage
  | RuntimeErrorMessage
  | LoaderReadyMessage
  | FixtureListUpdateMessage
  | FixtureSelectMessage
  | FixtureLoadMessage
  | FixtureUpdateMessage
  | FixtureEditMessage;
