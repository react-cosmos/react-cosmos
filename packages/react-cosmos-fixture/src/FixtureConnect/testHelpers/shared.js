// @flow

import until from 'async-until';
import type { Element } from 'react';
import type { FixtureState } from 'react-cosmos-shared2/fixtureState';
import type {
  RendererId,
  RendererRequest,
  RendererResponse
} from 'react-cosmos-shared2/renderer';
import type { Fixtures } from '../../index.js.flow';

type Message = RendererResponse | RendererRequest;

type GetTestElement = ({
  fixtures: Fixtures,
  rendererId: RendererId
}) => Element<any>;

type GetMessages = () => Message[];

export type ConnectMockApi = {
  getElement: GetTestElement,
  postMessage: (msg: RendererRequest) => Promise<mixed>,
  untilMessage: (msg: {}) => Promise<mixed>,
  getFxStateFromLastChange: () => Promise<FixtureState>,
  getFxStateFromLastSync: () => Promise<FixtureState>,
  selectFixture: ({
    rendererId: RendererId,
    fixturePath: null | string
  }) => Promise<mixed>,
  setFixtureState: ({
    rendererId: RendererId,
    fixturePath: string,
    fixtureStateChange: $Shape<FixtureState>
  }) => Promise<mixed>
};

const timeout = 1000;

export async function getFixtureStateFromLastChange(getMessages: GetMessages) {
  return getFixtureStateFromLastMsgOfType(getMessages, 'fixtureStateChange');
}

export async function getFixtureStateFromLastSync(getMessages: GetMessages) {
  return getFixtureStateFromLastMsgOfType(getMessages, 'fixtureStateSync');
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
    fixturePath
  }: { rendererId: RendererId, fixturePath: null | string }
) {
  return postMessage({
    type: 'selectFixture',
    payload: {
      rendererId,
      fixturePath
    }
  });
}

export async function postSetFixtureState(
  postMessage: Message => mixed,
  {
    rendererId,
    fixturePath,
    fixtureStateChange
  }: {
    rendererId: RendererId,
    fixturePath: string,
    fixtureStateChange: $Shape<FixtureState>
  }
) {
  return postMessage({
    type: 'setFixtureState',
    payload: {
      rendererId,
      fixturePath,
      fixtureStateChange
    }
  });
}

function getLastMessage(messages: Message[]) {
  if (messages.length === 0) {
    return null;
  }

  return messages[messages.length - 1];
}

async function getFixtureStateFromLastMsgOfType(
  getMessages: GetMessages,
  msgType: 'fixtureStateChange' | 'fixtureStateSync'
) {
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
