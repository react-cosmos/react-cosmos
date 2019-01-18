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
  RendererResponse
} from 'react-cosmos-shared2/renderer';
import type {
  Fixtures,
  DecoratorsByPath,
  RemoteRendererApi
} from '../index.js.flow';

type Message = RendererResponse | RendererRequest;

type FixtureConnectUserProps = {
  rendererId: RendererId,
  fixtures: Fixtures,
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
  selectFixture: ({
    rendererId: RendererId,
    fixturePath: string,
    fixtureState: null | FixtureState
  }) => Promise<mixed>,
  unselectFixture: ({
    rendererId: RendererId
  }) => Promise<mixed>,
  setFixtureState: ({
    rendererId: RendererId,
    fixturePath: string,
    fixtureState: null | FixtureState
  }) => Promise<mixed>
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
      const msgType = 'fixtureStateChange';

      await until(() => {
        const lastMsg = getLastMessage();

        return lastMsg && lastMsg.type === msgType;
      });

      const lastMsg = getLastMessage();

      if (!lastMsg || lastMsg.type !== msgType) {
        throw new Error(`Last message type should be "${msgType}"`);
      }

      return lastMsg.payload.fixtureState;
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

    async function selectFixture({ rendererId, fixturePath, fixtureState }) {
      return postMessage({
        type: 'selectFixture',
        payload: {
          rendererId,
          fixturePath,
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

    async function setFixtureState({ rendererId, fixturePath, fixtureState }) {
      return postMessage({
        type: 'setFixtureState',
        payload: {
          rendererId,
          fixturePath,
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
