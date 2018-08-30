// @flow

import type { Node, Element } from 'react';
import type { Fixtures } from './fixtures';
import type { FixtureState, SetFixtureState } from './fixtureState';
import type { RemoteRendererApi } from './messages';

export type FixtureConnectProps = {
  rendererId: string,
  fixtures: Fixtures
} & RemoteRendererApi;

export type FixtureProviderProps = {
  children: Node,
  fixtureState: ?FixtureState,
  setFixtureState: SetFixtureState
};

export type CapturePropsProps = {
  children: Element<any>
};

export type ComponentStateProps = {
  children: Element<any>,
  state?: Object
};
