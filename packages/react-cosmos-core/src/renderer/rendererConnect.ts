import { FixtureState } from '../fixtureState/types.js';
import {
  NotificationItem,
  TimedNotificationItem,
} from '../playground/notifications.js';
import {
  FixtureId,
  FixtureList,
  FixtureListItem,
} from '../userModules/fixtureTypes.js';

// FYI: Renderer ids are self assigned in remote environments, so uniqueness
// cannot be established by consensus
export type RendererId = string;

export type FixtureParams = Record<string, string>;

export type PingRenderersRequest = {
  type: 'pingRenderers';
};

export type ReloadRendererRequest = {
  type: 'reloadRenderer';
  payload: {
    rendererId: RendererId;
  };
};

export type SelectFixtureRequest = {
  type: 'selectFixture';
  payload: {
    rendererId: RendererId;
    fixtureId: FixtureId;
    fixtureState: FixtureState;
  };
};

export type UnselectFixtureRequest = {
  type: 'unselectFixture';
  payload: {
    rendererId: RendererId;
  };
};

export type SetFixtureParamsRequest = {
  type: 'setFixtureParams';
  payload: {
    rendererId: RendererId;
    // The fixture ID is sent alongside the fixture params change to ensure
    // that the fixture params is only paired with its corresponding fixture
    fixtureId: FixtureId;
    fixtureParams: FixtureParams;
  };
};

export type SetFixtureStateRequest = {
  type: 'setFixtureState';
  payload: {
    rendererId: RendererId;
    // The fixture ID is sent alongside the fixture state change to ensure
    // that the fixture state is only paired with its corresponding fixture
    fixtureId: FixtureId;
    fixtureState: FixtureState;
  };
};

export type RendererRequest =
  | PingRenderersRequest
  | ReloadRendererRequest
  | SelectFixtureRequest
  | UnselectFixtureRequest
  | SetFixtureParamsRequest
  | SetFixtureStateRequest;

export type RendererReadyResponse = {
  type: 'rendererReady';
  payload: {
    rendererId: RendererId;
    selectedFixtureId?: FixtureId | null;
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
    fixtures: FixtureList;
  };
};

export type FixtureLoadedResponse = {
  type: 'fixtureLoaded';
  payload: {
    rendererId: RendererId;
    fixture: FixtureListItem;
    fixtureOptions: {};
  };
};

export type FixtureChangeResponse = {
  type: 'fixtureChange';
  payload: {
    rendererId: RendererId;
    fixtureId: FixtureId;
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
    fixtureState: FixtureState;
  };
};

export type PlaygroundCommandResponse = {
  type: 'playgroundCommand';
  payload: {
    command: string;
  };
};

export type PushStickyNotificationResponse = {
  type: 'pushStickyNotification';
  payload: {
    rendererId: RendererId;
    fixtureId: FixtureId;
    notification: NotificationItem;
  };
};

export type RemoveStickyNotificationResponse = {
  type: 'removeStickyNotification';
  payload: {
    rendererId: RendererId;
    fixtureId: FixtureId;
    notificationId: string;
  };
};

export type PushTimedNotificationResponse = {
  type: 'pushTimedNotification';
  payload: {
    rendererId: RendererId;
    fixtureId: FixtureId;
    notification: TimedNotificationItem;
  };
};

export type RendererResponse =
  | RendererReadyResponse
  | RendererErrorResponse
  | FixtureLoadedResponse
  | FixtureListUpdateResponse
  | FixtureChangeResponse
  | FixtureStateChangeResponse
  | PlaygroundCommandResponse
  | PushStickyNotificationResponse
  | RemoveStickyNotificationResponse
  | PushTimedNotificationResponse;

export type RendererConnect<
  Request = RendererRequest,
  Response = RendererResponse,
> = {
  postMessage: (msg: Response) => unknown;
  onMessage(handler: (msg: Request) => unknown): () => void;
};
