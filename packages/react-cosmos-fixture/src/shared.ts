import { StateUpdater } from 'react-cosmos-shared2/util';
import { FixtureState } from 'react-cosmos-shared2/fixtureState';
import {
  OnRendererRequest,
  OnRendererResponse
} from 'react-cosmos-shared2/renderer';

export type RendererConnect = {
  postMessage: OnRendererResponse;
  onMessage(handler: OnRendererRequest): () => unknown;
};

export type FixtureContextValue = {
  fixtureState: FixtureState;
  setFixtureState: SetFixtureState;
};

export type SetFixtureState = (update: StateUpdater<FixtureState>) => unknown;
