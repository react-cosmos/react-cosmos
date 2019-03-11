import { FixtureState } from './fixtureState';

// FYI: Renderer ids are self assigned in remote environments, so uniqueness
// cannot be established by consensus
export type RendererId = string;

export type FixtureNamesByPath = {
  [fixturePath: string]: null | string[];
};

export type FixtureId = {
  path: string;
  name: null | string;
};

export type PingRenderersRequest = {
  type: 'pingRenderers';
};

export type SelectFixtureRequest = {
  type: 'selectFixture';
  payload: {
    rendererId: RendererId;
    fixtureId: FixtureId;
    fixtureState: null | FixtureState;
  };
};

export type UnselectFixtureRequest = {
  type: 'unselectFixture';
  payload: {
    rendererId: RendererId;
  };
};

export type SetFixtureStateRequest = {
  type: 'setFixtureState';
  payload: {
    rendererId: RendererId;
    // The fixture ID is sent alongside the fixture state change to ensure
    // that the fixture state is only paired with its corresponding fixture
    fixtureId: FixtureId;
    fixtureState: null | FixtureState;
  };
};

export type RendererRequest =
  | PingRenderersRequest
  | SelectFixtureRequest
  | UnselectFixtureRequest
  | SetFixtureStateRequest;

export type OnRendererRequest = (msg: RendererRequest) => unknown;

export type RendererReadyResponse = {
  type: 'rendererReady';
  payload: {
    rendererId: RendererId;
    fixtures: FixtureNamesByPath;
  };
};

export type RendererErrorResponse = {
  type: 'rendererError';
  payload: {
    rendererId: RendererId;
  };
};

export type FixtureListUpdateResponse = {
  type: 'fixtureListUpdate';
  payload: {
    rendererId: RendererId;
    fixtures: FixtureNamesByPath;
  };
};

// Caused by an organic state change inside the renderer. Also dispatched
// after a fixtureSelect request, when rendering stateful components, as their
// initial state is read.
export type FixtureStateChangeResponse = {
  type: 'fixtureStateChange';
  payload: {
    rendererId: RendererId;
    // The fixture ID is sent alongside the fixture state to ensure that the
    // fixture state is only paired with its corresponding fixture
    fixtureId: FixtureId;
    // Entire fixture state is included
    fixtureState: null | FixtureState;
  };
};

export type RendererResponse =
  | RendererReadyResponse
  | RendererErrorResponse
  | FixtureListUpdateResponse
  | FixtureStateChangeResponse;

export type OnRendererResponse = (msg: RendererResponse) => unknown;

export const RENDERER_MESSAGE_EVENT_NAME = 'cosmos-cmd';
