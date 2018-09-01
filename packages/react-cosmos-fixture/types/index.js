// @flow

import type { Node, Element } from 'react';
import type { SetState } from 'react-cosmos-shared2/util';
import type { FixtureState } from 'react-cosmos-shared2/fixtureState';
import type {
  OnRendererRequest,
  OnRendererResponse
} from 'react-cosmos-shared2/renderer';

export type Fixtures = {
  [path: string]: Node
};

export type RemoteRendererApi = {
  subscribe: OnRendererRequest => mixed,
  unsubscribe: () => mixed,
  postMessage: OnRendererResponse
};

export type FixtureConnectProps = {
  rendererId: string,
  fixtures: Fixtures
} & RemoteRendererApi;

export type PostMessageProps = {
  children: RemoteRendererApi => Element<any>
};

export type WebSocketsProps = {
  children: RemoteRendererApi => Element<any>,
  url: string
};

export type FixtureContextValue = {
  fixtureState: ?FixtureState,
  setFixtureState: SetState<FixtureState>
};

export type FixtureProviderProps = {
  children: Node
} & FixtureContextValue;

export type CapturePropsProps = {
  children: Element<any>
};

export type ComponentStateProps = {
  children: Element<any>,
  state?: Object
};
