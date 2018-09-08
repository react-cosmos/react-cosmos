/* eslint-env jest */
/* istanbul ignore file */
// @flow

import { Component } from 'react';
import until from 'async-until';
import type { Element } from 'react';
import type { FixtureState } from 'react-cosmos-shared2/fixtureState';
import type {
  RendererId,
  RendererRequest,
  RendererResponse
} from 'react-cosmos-shared2/renderer';
import type { Fixtures } from '../../index.js.flow';

export type Message = RendererResponse | RendererRequest;

export type GetTestElement = ({
  fixtures: Fixtures,
  rendererId: RendererId
}) => Element<any>;

export type ConnectMockApi = {
  getElement: GetTestElement,
  postMessage: (msg: Message) => Promise<mixed>,
  untilMessage: (msg: {}) => Promise<mixed>,
  lastFixtureState: () => FixtureState,
  selectFixture: ({ rendererId: RendererId, fixturePath: ?string }) => Promise<
    mixed
  >,
  setFixtureState: ({
    rendererId: RendererId,
    fixturePath: string,
    fixtureStateChange: $Shape<FixtureState>
  }) => Promise<mixed>
};

const timeout = 1000;

export async function getLastFixtureState(getMessages: () => Message[]) {
  await until(
    () => {
      const lastMsg = getLastMessage(getMessages());

      return lastMsg && lastMsg.type === 'fixtureState';
    },
    { timeout }
  );

  const lastMsg = getLastMessage(getMessages());

  if (!lastMsg || lastMsg.type !== 'fixtureState') {
    throw new Error('Last message type should be "fixtureState"');
  }

  return lastMsg.payload.fixtureState;
}

export async function untilLastMessageEquals(
  getMessages: () => Message[],
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
  { rendererId, fixturePath }: { rendererId: RendererId, fixturePath: ?string }
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

export class HelloMessage extends Component<{ name?: string }> {
  render() {
    return `Hello ${this.props.name || 'Stranger'}`;
  }
}
