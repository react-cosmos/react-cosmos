import { StateUpdater } from 'react-cosmos-shared2/util';
import { FixtureState } from 'react-cosmos-shared2/fixtureState';
import {
  OnRendererRequest,
  OnRendererResponse
} from 'react-cosmos-shared2/renderer';

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
