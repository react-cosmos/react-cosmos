// @flow

import until from 'async-until';
import type { Element } from 'react';
import type { FixtureState } from 'react-cosmos-shared2/fixtureState';
import type {
  RendererId,
  RendererRequest,
  RendererResponse
} from 'react-cosmos-shared2/renderer';
import type { Fixtures, DecoratorsByPath } from '../index.js.flow';

type Message = RendererResponse | RendererRequest;

type GetTestElement = ({
  rendererId: RendererId,
  fixtures: Fixtures,
  decorators: DecoratorsByPath,
  onFixtureChange?: () => mixed
}) => Element<any>;

type GetMessages = () => Message[];

export type ConnectMockApi = {
  getElement: GetTestElement,
  postMessage: (msg: RendererRequest) => Promise<mixed>,
  untilMessage: (msg: {}) => Promise<mixed>,
  getFxStateFromLastChange: () => Promise<null | FixtureState>,
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

const timeout = 1000;

export async function getFixtureStateFromLastChange(getMessages: GetMessages) {
  const msgType = 'fixtureStateChange';

  await until(
    () => {
      const lastMsg = getLastMessage(getMessages());

      return lastMsg && lastMsg.type === msgType;
    },
    { timeout }
  );

  const lastMsg = getLastMessage(getMessages());

  if (!lastMsg || lastMsg.type !== msgType) {
    throw new Error(`Last message type should be "${msgType}"`);
  }

  return lastMsg.payload.fixtureState;
}

export async function untilLastMessageEquals(
  getMessages: GetMessages,
  msg: {}
) {
  try {
    await until(
      () => {
        try {
          // Support expect.any(constructor) matches
          // https://jestjs.io/docs/en/expect#expectanyconstructor
          expect(getLastMessage(getMessages())).toEqual(msg);

          return true;
        } catch (err) {
          return false;
        }
      },
      { timeout }
    );
  } catch (err) {
    expect(getLastMessage(getMessages())).toEqual(msg);
  }
}

export async function postSelectFixture(
  postMessage: Message => mixed,
  {
    rendererId,
    fixturePath,
    fixtureState
  }: {
    rendererId: RendererId,
    fixturePath: string,
    fixtureState: null | FixtureState
  }
) {
  return postMessage({
    type: 'selectFixture',
    payload: {
      rendererId,
      fixturePath,
      fixtureState
    }
  });
}

export async function postUnselectFixture(
  postMessage: Message => mixed,
  { rendererId }: { rendererId: RendererId }
) {
  return postMessage({
    type: 'unselectFixture',
    payload: {
      rendererId
    }
  });
}

export async function postSetFixtureState(
  postMessage: Message => mixed,
  {
    rendererId,
    fixturePath,
    fixtureState
  }: {
    rendererId: RendererId,
    fixturePath: string,
    fixtureState: null | FixtureState
  }
) {
  return postMessage({
    type: 'setFixtureState',
    payload: {
      rendererId,
      fixturePath,
      fixtureState
    }
  });
}

function getLastMessage(messages: Message[]) {
  if (messages.length === 0) {
    return null;
  }

  return messages[messages.length - 1];
}
