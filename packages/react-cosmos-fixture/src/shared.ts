import * as React from 'react';
import { StateUpdater } from 'react-cosmos-shared2/util';
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

export type RendererConnectApi = {
  postMessage: OnRendererResponse;
  off: () => unknown;
};

export type RendererConnect = (
  onMessage: OnRendererRequest
) => RendererConnectApi;

export type FixtureContextValue = {
  fixtureState: FixtureState;
  setFixtureState: SetFixtureState;
};

export type SetFixtureState = (update: StateUpdater<FixtureState>) => unknown;
