// @flow

import type { Node, Element } from 'react';
import type {
  FixtureState,
  SetFixtureState,
  OnRendererMessage,
  OnRemoteMessage
} from 'react-cosmos-shared2';

export type Fixtures = {
  [path: string]: Node
};

export type RemoteRendererApi = {
  subscribe: OnRemoteMessage => mixed,
  unsubscribe: () => mixed,
  postMessage: OnRendererMessage
};

export type FixtureConnectProps = {
  rendererId: string,
  fixtures: Fixtures
} & RemoteRendererApi;

export type FixtureProviderProps = {
  children: Node,
  fixtureState: ?FixtureState,
  setFixtureState: SetFixtureState
};

export type FixtureContextValue = {
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
