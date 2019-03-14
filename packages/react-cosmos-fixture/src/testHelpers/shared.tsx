import * as React from 'react';
import until from 'async-until';
import { FixtureConnect } from '..';
import {
  RendererId,
  RendererRequest,
  RendererResponse,
  SelectFixtureRequest,
  UnselectFixtureRequest,
  SetFixtureStateRequest,
  RendererReadyResponse,
  FixtureListUpdateResponse,
  FixtureStateChangeResponse
} from 'react-cosmos-shared2/renderer';
import { FixtureState } from 'react-cosmos-shared2/fixtureState';
import { FixturesByPath, DecoratorsByPath, RemoteRendererApi } from '../shared';
import { ReactTestRenderer } from 'react-test-renderer';

export type Message = RendererResponse | RendererRequest;

type GetMessages = () => Message[];

export type MountFixtureConnectArgs = {
  rendererId: RendererId;
  fixtures: FixturesByPath;
  decorators: DecoratorsByPath;
  onFixtureChange?: () => unknown;
};

export type FixtureConnectMockApi = {
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

export type FixtureConnectTestApi = {
  renderer: ReactTestRenderer;
  update: (args: MountFixtureConnectArgs) => void;
} & FixtureConnectMockApi;

export type MountFixtureConnect = (
  args: MountFixtureConnectArgs,
  cb: (api: FixtureConnectTestApi) => void
) => Promise<void>;

type FixtureConnectMockArgs = {
  getMessages: GetMessages;
  postMessage: (msg: Message) => unknown;
};

export function createFixtureConnectRenderCb({
  rendererId,
  fixtures,
  decorators,
  onFixtureChange
}: MountFixtureConnectArgs) {
  return (remoteRendererApiProps: RemoteRendererApi) => (
    <FixtureConnect
      rendererId={rendererId}
      fixtures={fixtures}
      systemDecorators={[]}
      userDecorators={decorators}
      onFixtureChange={onFixtureChange}
      {...remoteRendererApiProps}
    />
  );
}

export function createFixtureConnectMockApi(
  args: FixtureConnectMockArgs
): FixtureConnectMockApi {
  return {
    pingRenderers,
    selectFixture,
    unselectFixture,
    setFixtureState,
    rendererReady,
    fixtureListUpdate,
    fixtureStateChange,
    getLastFixtureState
  };

  async function pingRenderers() {
    return postMessage({
      type: 'pingRenderers'
    });
  }

  async function selectFixture({
    rendererId,
    fixtureId,
    fixtureState
  }: SelectFixtureRequest['payload']) {
    return postMessage({
      type: 'selectFixture',
      payload: {
        rendererId,
        fixtureId,
        fixtureState
      }
    });
  }

  async function unselectFixture({
    rendererId
  }: UnselectFixtureRequest['payload']) {
    return postMessage({
      type: 'unselectFixture',
      payload: {
        rendererId
      }
    });
  }

  async function setFixtureState({
    rendererId,
    fixtureId,
    fixtureState
  }: SetFixtureStateRequest['payload']) {
    return postMessage({
      type: 'setFixtureState',
      payload: {
        rendererId,
        fixtureId,
        fixtureState
      }
    });
  }

  async function rendererReady({
    rendererId,
    fixtures
  }: RendererReadyResponse['payload']) {
    await untilMessage({
      type: 'rendererReady',
      payload: {
        rendererId,
        fixtures
      }
    });
  }

  async function fixtureListUpdate({
    rendererId,
    fixtures
  }: FixtureListUpdateResponse['payload']) {
    await untilMessage({
      type: 'fixtureListUpdate',
      payload: {
        rendererId,
        fixtures
      }
    });
  }

  async function fixtureStateChange({
    rendererId,
    fixtureId,
    fixtureState
  }: FixtureStateChangeResponse['payload']) {
    await untilMessage({
      type: 'fixtureStateChange',
      payload: {
        rendererId,
        fixtureId,
        fixtureState
      }
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
    // This is very convenient because we don't have to await manually for
    // each dispatched event to be fulfilled inside test cases
    await untilMessage(msg);
  }

  async function untilMessage(msg: Message) {
    try {
      await until(() => {
        try {
          // Support expect.any(constructor) matches
          // https://jestjs.io/docs/en/expect#expectanyconstructor
          expect(getLastMessage()).toEqual(msg);
          return true;
        } catch (err) {
          return false;
        }
      });
    } catch (err) {
      expect(getLastMessage()).toEqual(msg);
    }
  }

  async function getLastMessageOfType<M extends Message>(
    msgType: string
  ): Promise<M> {
    let lastMsg = null as null | Message;

    try {
      await until(() => {
        lastMsg = getLastMessage();
        return lastMsg && lastMsg.type === msgType;
      });
    } finally {
      if (!lastMsg || lastMsg.type !== msgType) {
        /* tslint:disable:no-unsafe-finally */
        throw new Error(`"${msgType}" message never arrived`);
        /* tslint:enable:no-unsafe-finally */
      }
    }

    return lastMsg as M;
  }

  function getLastMessage(): null | Message {
    const messages = args.getMessages();
    return messages.length === 0 ? null : messages[messages.length - 1];
  }
}
