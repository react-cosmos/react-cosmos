// @flow

import React from 'react';
import delay from 'delay';
import until from 'async-until';
import { FixtureConnect } from '..';

import type { Element } from 'react';
import type { FixtureState } from 'react-cosmos-shared2/fixtureState';
import type {
  RendererId,
  RendererRequest,
  RendererResponse,
  SelectFixtureRequest,
  UnselectFixtureRequest,
  SetFixtureStateRequest
} from 'react-cosmos-shared2/renderer';
import type {
  FixturesByPath,
  DecoratorsByPath,
  RemoteRendererApi
} from '../index.js.flow';

type Message = RendererResponse | RendererRequest;

type FixtureConnectUserProps = {
  rendererId: RendererId,
  fixtures: FixturesByPath,
  decorators: DecoratorsByPath,
  onFixtureChange?: () => mixed
};

type GetTestElement = FixtureConnectUserProps => Element<any>;

type GetMessages = () => Message[];

type ConnectMockCreatorApi = {
  getElement: GetTestElement,
  getMessages: GetMessages,
  postMessage: (msg: Message) => mixed,
  cleanup: () => mixed
};

type ConnectMockCreator = () => ConnectMockCreatorApi;

export type ConnectMockApi = {
  getElement: GetTestElement,
  postMessage: (msg: RendererRequest) => Promise<mixed>,
  untilMessage: (msg: {}) => Promise<mixed>,
  getLastFixtureState: () => Promise<null | FixtureState>,
  selectFixture: (
    $PropertyType<SelectFixtureRequest, 'payload'>
  ) => Promise<mixed>,
  unselectFixture: (
    $PropertyType<UnselectFixtureRequest, 'payload'>
  ) => Promise<mixed>,
  setFixtureState: (
    $PropertyType<SetFixtureStateRequest, 'payload'>
  ) => Promise<mixed>
};

export function createConnectMock(init: ConnectMockCreator) {
  return async function mockConnect(
    children: ConnectMockApi => Promise<mixed>
  ) {
    const api = init();
    const { getElement, cleanup, getMessages } = api;

    async function postMessage(msg) {
      api.postMessage(msg);
      // This is very convenient because we don't have to await manually for
      // each dispatched event to be fulfilled inside test cases
      await untilMessage(msg);
      // Allow render tree to update. Having this here isn't great, but to
      // remove it we need to turn a convert of plain expects into async expects
      await delay(0);
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
      const msg = await getLastMessageOfType('fixtureStateChange');

      return msg.payload.fixtureState;
    }

    async function untilMessage(msg) {
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

    async function selectFixture({ rendererId, fixtureId, fixtureState }) {
      return postMessage({
        type: 'selectFixture',
        payload: {
          rendererId,
          fixtureId,
          fixtureState
        }
      });
    }

    async function unselectFixture({ rendererId }) {
      return postMessage({
        type: 'unselectFixture',
        payload: {
          rendererId
        }
      });
    }

    async function setFixtureState({ rendererId, fixtureId, fixtureState }) {
      return postMessage({
        type: 'setFixtureState',
        payload: {
          rendererId,
          fixtureId,
          fixtureState
        }
      });
    }

    function getLastMessage() {
      const messages = getMessages();

      if (messages.length === 0) {
        return null;
      }

      return messages[messages.length - 1];
    }

    async function getLastMessageOfType(msgType) {
      let lastMsg;

      try {
        await until(() => {
          lastMsg = getLastMessage();
          return lastMsg && lastMsg.type === msgType;
        });
      } finally {
        if (!lastMsg || lastMsg.type !== msgType) {
          // eslint-disable-next-line
          throw new Error(`"${msgType}" message never arrived`);
        }
      }

      return lastMsg;
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
