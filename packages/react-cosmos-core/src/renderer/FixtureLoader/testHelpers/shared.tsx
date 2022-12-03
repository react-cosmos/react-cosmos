import until from 'async-until';
import { findLast } from 'lodash-es';
import { ReactTestRenderer } from 'react-test-renderer';
import { FixtureId } from '../../../fixture/types.js';
import { FixtureState } from '../../../fixtureState/types.js';
import { ReactDecorators, ReactFixtureWrappers } from '../../reactTypes.js';
import {
  FixtureListUpdateResponse,
  FixtureStateChangeResponse,
  RendererId,
  RendererReadyResponse,
  RendererRequest,
  RendererResponse,
  SelectFixtureRequest,
  SetFixtureStateRequest,
  UnselectFixtureRequest,
} from '../../types.js';

export type RendererMessage = RendererResponse | RendererRequest;

type GetMessages = () => RendererMessage[];

export type FixtureLoaderTestArgs = {
  rendererId: RendererId;
  fixtures: ReactFixtureWrappers;
  selectedFixtureId?: null | FixtureId;
  initialFixtureId?: FixtureId;
  decorators?: ReactDecorators;
  onErrorReset?: () => unknown;
};

export type RendererConnectMockApi = {
  pingRenderers: () => Promise<unknown>;
  selectFixture: (payload: SelectFixtureRequest['payload']) => Promise<unknown>;
  unselectFixture: (
    payload: UnselectFixtureRequest['payload']
  ) => Promise<unknown>;
  setFixtureState: (
    payload: SetFixtureStateRequest['payload']
  ) => Promise<unknown>;
  rendererReady: (
    payload: RendererReadyResponse['payload']
  ) => Promise<unknown>;
  fixtureListUpdate: (
    payload: FixtureListUpdateResponse['payload']
  ) => Promise<unknown>;
  fixtureStateChange: (
    payload: FixtureStateChangeResponse['payload']
  ) => Promise<unknown>;
  getLastFixtureState: () => Promise<FixtureState>;
};

export type FixtureLoaderTestApi = {
  renderer: ReactTestRenderer;
  update: (args: FixtureLoaderTestArgs) => void;
} & RendererConnectMockApi;

export type FixtureLoaderTestCallback = (
  api: FixtureLoaderTestApi
) => Promise<void>;

type RendererConnectMockArgs = {
  getMessages: GetMessages;
  postMessage: (msg: RendererMessage) => unknown;
};

export function createRendererConnectMockApi(
  args: RendererConnectMockArgs
): RendererConnectMockApi {
  return {
    pingRenderers,
    selectFixture,
    unselectFixture,
    setFixtureState,
    rendererReady,
    fixtureListUpdate,
    fixtureStateChange,
    getLastFixtureState,
  };

  async function pingRenderers() {
    return postMessage({
      type: 'pingRenderers',
    });
  }

  async function selectFixture(payload: SelectFixtureRequest['payload']) {
    return postMessage({
      type: 'selectFixture',
      payload,
    });
  }

  async function unselectFixture(payload: UnselectFixtureRequest['payload']) {
    return postMessage({
      type: 'unselectFixture',
      payload,
    });
  }

  async function setFixtureState(payload: SetFixtureStateRequest['payload']) {
    return postMessage({
      type: 'setFixtureState',
      payload,
    });
  }

  async function rendererReady(payload: RendererReadyResponse['payload']) {
    await untilMessage({
      type: 'rendererReady',
      payload,
    });
  }

  async function fixtureListUpdate(
    payload: FixtureListUpdateResponse['payload']
  ) {
    await untilMessage({
      type: 'fixtureListUpdate',
      payload,
    });
  }

  async function fixtureStateChange(
    payload: FixtureStateChangeResponse['payload']
  ) {
    await untilMessage({
      type: 'fixtureStateChange',
      payload,
    });
  }

  async function getLastFixtureState() {
    const msg = await getLastMessageOfType<FixtureStateChangeResponse>(
      'fixtureStateChange'
    );
    return msg.payload.fixtureState;
  }

  async function postMessage(msg: RendererRequest) {
    args.postMessage(msg);
  }

  async function untilMessage(msg: RendererMessage) {
    try {
      await until(
        () => {
          try {
            // Support expect.any(constructor) matches
            // https://jestjs.io/docs/en/expect#expectanyconstructor
            expect(findLastMessageWithType(msg.type)).toEqual(msg);
            return true;
          } catch (err) {
            return false;
          }
        },
        { timeout: 1000 }
      );
    } catch (err) {
      expect(getLastMessage()).toEqual(msg);
    }
  }

  async function getLastMessageOfType<M extends RendererMessage>(
    msgType: string
  ): Promise<M> {
    let lastMsg = null as null | RendererMessage;

    try {
      await until(() => {
        lastMsg = getLastMessage();
        return lastMsg && lastMsg.type === msgType;
      });
    } finally {
      if (!lastMsg || lastMsg.type !== msgType) {
        throw new Error(`"${msgType}" message never arrived`);
      }
    }

    return lastMsg as M;
  }

  function getLastMessage(): null | RendererMessage {
    const messages = args.getMessages();
    return messages.length === 0 ? null : messages[messages.length - 1];
  }

  function findLastMessageWithType(type: string): null | RendererMessage {
    const messages = args.getMessages();
    return findLast(messages, msg => msg.type === type) ?? null;
  }
}
