import * as React from 'react';
import { StateUpdater, SetStateAsync } from 'react-cosmos-shared2/util';
import { FixtureState } from 'react-cosmos-shared2/fixtureState';
import {
  OnRendererRequest,
  OnRendererResponse
} from 'react-cosmos-shared2/renderer';

export type NodeMap = { [fixtureName: string]: React.ReactNode };

export type FixtureExport = React.ReactNode | NodeMap;

export type FixturesByPath = {
  [path: string]: FixtureExport;
};

export type DecoratorType = React.ComponentType<{ children: React.ReactNode }>;

export type DecoratorsByPath = {
  [path: string]: DecoratorType;
};

export type RemoteRendererApi = {
  subscribe: (request: OnRendererRequest) => unknown;
  unsubscribe: () => unknown;
  postMessage: OnRendererResponse;
};

export type FixtureContextValue = {
  fixtureState: FixtureState;
  setFixtureState: SetFixtureState;
};

export type SetFixtureState = SetStateAsync<StateUpdater<FixtureState>>;
