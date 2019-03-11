import * as React from 'react';
// import * as delay from 'delay';
import until from 'async-until';
import { FixtureConnect } from '..';
import {
  RendererId,
  RendererRequest,
  RendererResponse,
  SelectFixtureRequest,
  UnselectFixtureRequest,
  SetFixtureStateRequest,
  FixtureStateChangeResponse
} from 'react-cosmos-shared2/renderer';
import { FixtureState } from 'react-cosmos-shared2/fixtureState';
import { FixturesByPath, DecoratorsByPath, RemoteRendererApi } from '../types';

export type Message = RendererResponse | RendererRequest;

export type FixtureConnectUserProps = {
  rendererId: RendererId;
  fixtures: FixturesByPath;
  decorators: DecoratorsByPath;
  onFixtureChange?: () => unknown;
};

type GetTestElement = (
  props: FixtureConnectUserProps
) => React.ReactElement<any>;

type GetMessages = () => Message[];

type ConnectMockCreatorApi = {
  getElement: GetTestElement;
  getMessages: GetMessages;
  postMessage: (msg: Message) => unknown;
  cleanup: () => unknown;
};

type ConnectMockCreator = () => ConnectMockCreatorApi;

export type ConnectMockApi = {
  getElement: GetTestElement;
  postMessage: (msg: RendererRequest) => Promise<unknown>;
  untilMessage: (msg: {}) => Promise<unknown>;
  getLastFixtureState: () => Promise<null | FixtureState>;
  selectFixture: (payload: SelectFixtureRequest['payload']) => Promise<unknown>;
  unselectFixture: (
    payload: UnselectFixtureRequest['payload']
  ) => Promise<unknown>;
  setFixtureState: (
    payload: SetFixtureStateRequest['payload']
  ) => Promise<unknown>;
};

export function createConnectMock(init: ConnectMockCreator) {
  return async function mockConnect(
    children: (api: ConnectMockApi) => Promise<unknown>
  ) {
    const api = init();
    const { getElement, cleanup, getMessages } = api;

    async function postMessage(msg: RendererRequest) {
      api.postMessage(msg);
      // This is very convenient because we don't have to await manually for
      // each dispatched event to be fulfilled inside test cases
      await untilMessage(msg);
    }

    try {
      await children({
        getElement,
        untilMessage,
        getLastFixtureState,
        postMessage,
        selectFixture,
        unselectFixture,
        setFixtureState
      });
    } finally {
      cleanup();
    }

    async function getLastFixtureState() {
      const msg = await getLastMessageOfType<FixtureStateChangeResponse>(
        'fixtureStateChange'
      );
      return msg.payload.fixtureState;
    }

    async function untilMessage(msg: {}) {
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

    function getLastMessage(): null | Message {
      const messages = getMessages();

      if (messages.length === 0) {
        return null;
      }

      return messages[messages.length - 1];
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
  };
}

export function createFixtureConnectRenderCallback({
  rendererId,
  fixtures,
  decorators,
  onFixtureChange
}: FixtureConnectUserProps) {
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
