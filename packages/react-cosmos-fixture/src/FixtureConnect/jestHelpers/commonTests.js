/* eslint-env browser, jest */
/* istanbul ignore file */
// @flow

import React from 'react';
import until from 'async-until';
import { create } from 'react-test-renderer';
import {
  getFixtureStateProps,
  updateFixtureStateProps
} from 'react-cosmos-shared2/fixtureState';
import { uuid } from '../../shared/uuid';
import { FixtureConnect } from '..';

import type { Element } from 'react';
import type { ReactTestRenderer } from 'react-test-renderer';
import type {
  RendererRequest,
  RendererResponse
} from 'react-cosmos-shared2/renderer';
import type { Fixtures, RemoteRendererApi } from '../../../types';

type Message = RendererResponse | RendererRequest;

export type MockRemoteArgs = {
  lastMessage: () => Message,
  messageSeq: (...string[]) => Promise<mixed>,
  postMessage: (msg: Object) => Promise<mixed>
};

type Args = {
  mockRemoteApi: ((MockRemoteArgs) => Promise<mixed>) => Promise<mixed>,
  getRemoteApi: (
    (RemoteRendererApi) => Element<typeof FixtureConnect>
  ) => Element<any>
};

export function testFixtureConnect({ mockRemoteApi, getRemoteApi }: Args) {
  const rendererId = uuid();

  async function mount(
    fixtures: Fixtures,
    children: ({ instance: ReactTestRenderer }) => Promise<mixed>
  ) {
    expect.hasAssertions();

    const instance = create(
      getRemoteApi(({ subscribe, unsubscribe, postMessage }) => (
        <FixtureConnect
          rendererId={rendererId}
          fixtures={fixtures}
          subscribe={subscribe}
          unsubscribe={unsubscribe}
          postMessage={postMessage}
        />
      ))
    );

    try {
      await children({ instance });
    } finally {
      instance.unmount();
    }
  }

  it('renders blank state message', async () => {
    await mockRemoteApi(async ({ messageSeq }) => {
      await mount({}, async ({ instance }) => {
        expect(instance.toJSON()).toEqual('No fixture loaded.');

        // NOTE: Waiting for the fixtureList message to come isn't relevant
        // to this test, but if we don't it will leak into the following test,
        // as 'message' window events are delayed.
        await messageSeq('fixtureList');
      });
    });
  });

  it('posts fixture list on mount', async () => {
    const fixtures = {
      first: 'First fixture',
      second: 'Second fixture'
    };

    await mockRemoteApi(async ({ lastMessage, messageSeq }) => {
      await mount(fixtures, async () => {
        await messageSeq('fixtureList');

        expect(lastMessage()).toEqual({
          type: 'fixtureList',
          payload: {
            rendererId: expect.any(String),
            fixtures: ['first', 'second']
          }
        });
      });
    });
  });

  it('posts fixture list message again on request', async () => {
    const fixtures = {
      first: 'First fixture',
      second: 'Second fixture'
    };

    await mockRemoteApi(async ({ lastMessage, messageSeq, postMessage }) => {
      await mount(fixtures, async () => {
        await messageSeq('fixtureList');

        await postMessage({
          type: 'requestFixtureList'
        });

        // No `fixtureState` event was fired because the fixtures used are
        // string nodes without props or state
        await messageSeq('fixtureList', 'requestFixtureList', 'fixtureList');

        expect(lastMessage()).toEqual({
          type: 'fixtureList',
          payload: {
            rendererId: expect.any(String),
            fixtures: ['first', 'second']
          }
        });
      });
    });
  });

  it('renders selected fixture', async () => {
    const fixtures = {
      first: 'First fixture',
      second: 'Second fixture'
    };

    await mockRemoteApi(async ({ messageSeq, postMessage }) => {
      await mount(fixtures, async ({ instance }) => {
        await messageSeq('fixtureList');

        await postMessage({
          type: 'selectFixture',
          payload: {
            rendererId,
            fixturePath: 'first'
          }
        });

        expect(instance.toJSON()).toBe('First fixture');

        await postMessage({
          type: 'selectFixture',
          payload: {
            rendererId,
            fixturePath: null
          }
        });

        expect(instance.toJSON()).toBe('No fixture loaded.');
      });
    });
  });

  it('ignores select fixture message for different renderer', async () => {
    const fixtures = {
      first: 'First fixture',
      second: 'Second fixture'
    };

    await mockRemoteApi(async ({ postMessage, messageSeq }) => {
      await mount(fixtures, async ({ instance }) => {
        await messageSeq('fixtureList');

        await postMessage({
          type: 'selectFixture',
          payload: {
            rendererId: 'foobar',
            fixturePath: 'first'
          }
        });

        expect(instance.toJSON()).toBe('No fixture loaded.');
      });
    });
  });

  it('signals missing fixture path', async () => {
    const fixtures = {
      first: 'First fixture',
      second: 'Second fixture'
    };

    await mockRemoteApi(async ({ postMessage, messageSeq }) => {
      await mount(fixtures, async ({ instance }) => {
        await messageSeq('fixtureList');

        await postMessage({
          type: 'selectFixture',
          payload: {
            rendererId,
            fixturePath: 'third'
          }
        });

        expect(instance.toJSON()).toBe('Fixture path not found: third');
      });
    });
  });

  // Warning: This test has a bunch of steps incorporated because I thought it's
  // easier to follow the flow in a single run than in several tests with a lot
  // of initial repetition
  it('sets fixture state on selected fixture', async () => {
    const MyComponent = ({ name }) => `Hello ${name}`;
    const fixtures = {
      first: <MyComponent name="Bianca" />
    };

    await mockRemoteApi(async ({ lastMessage, messageSeq, postMessage }) => {
      await mount(fixtures, async ({ instance }) => {
        await messageSeq('fixtureList');

        await postMessage({
          type: 'selectFixture',
          payload: {
            rendererId,
            fixturePath: 'first'
          }
        });

        expect(instance.toJSON()).toBe('Hello Bianca');

        await messageSeq('fixtureList', 'selectFixture', 'fixtureState');

        expect(lastMessage()).toEqual({
          type: 'fixtureState',
          payload: {
            rendererId,
            fixturePath: 'first',
            fixtureState: {
              props: [getPropsInstanceShape('Bianca')]
            }
          }
        });

        const lastMsg = lastMessage();
        if (lastMsg.type !== 'fixtureState') {
          throw new Error('Last message type should be "fixtureState"');
        }

        const { fixtureState } = lastMsg.payload;
        const [{ instanceId }] = getFixtureStateProps(fixtureState);
        await postMessage({
          type: 'setFixtureState',
          payload: {
            rendererId,
            fixturePath: 'first',
            fixtureStateChange: {
              props: updateFixtureStateProps(fixtureState, instanceId, {
                name: 'B'
              })
            }
          }
        });

        await messageSeq(
          'fixtureList',
          'selectFixture',
          'fixtureState',
          'setFixtureState',
          'fixtureState'
        );

        expect(instance.toJSON()).toBe('Hello B');

        expect(lastMessage()).toEqual({
          type: 'fixtureState',
          payload: {
            rendererId,
            fixturePath: 'first',
            fixtureState: {
              props: [getPropsInstanceShape('B')]
            }
          }
        });
      });
    });
  });
}

export function getLastMessage(messages: Message[]) {
  if (messages.length === 0) {
    throw new Error('No message has been posted');
  }

  return messages[messages.length - 1];
}

export function getMessageSeq(messages: Message[]): string[] {
  return messages.map(msg => msg.type);
}

export async function expectMessageSeq(
  getMessages: () => Message[],
  types: string[]
) {
  try {
    await until(() => getMessages().length >= types.length, { timeout: 1000 });
  } catch (err) {
    // Let the following expect call fail with a proper output
  }

  expect(getMessageSeq(getMessages())).toEqual(types);
}

function getPropsInstanceShape(name) {
  return {
    instanceId: expect.any(Number),
    componentName: 'MyComponent',
    renderKey: expect.any(Number),
    values: [
      {
        serializable: true,
        key: 'name',
        value: name
      }
    ]
  };
}
