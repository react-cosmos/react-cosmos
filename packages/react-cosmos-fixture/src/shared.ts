import { FixtureState } from 'react-cosmos-shared2/fixtureState';
import { StateUpdater } from 'react-cosmos-shared2/util';
import {
  RendererRequest,
  RendererResponse
} from 'react-cosmos-shared2/renderer';

export type RendererConnect<
  Request = RendererRequest,
  Response = RendererResponse
> = {
  postMessage: (msg: Response) => unknown;
  onMessage(handler: (msg: Request) => unknown): () => unknown;
};

export type FixtureContextValue = {
  fixtureState: FixtureState;
  setFixtureState: SetFixtureState;
};

export type SetFixtureState = (update: StateUpdater<FixtureState>) => unknown;
