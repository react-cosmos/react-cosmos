// @flow

import React from 'react';
import { create } from 'react-test-renderer';
import { getProps, setProps } from '../../shared/fixtureState';
import { uuid } from '../../shared/uuid';
import { mockPostMessage } from '../../shared/jest/postMessage';
import { FixtureConnect } from '..';
import { PostMessage } from '../PostMessage';

const rendererId = uuid();

it('renders blank state message', async () => {
  await mockPostMessage(async ({ messageSeq }) => {
    await mountFixtureConnect({}, async ({ instance }) => {
      expect(instance.toJSON()).toEqual('No fixture loaded.');

      // NOTE: Waiting for the rendererReady message to register isn't relevant
      // to this test, but if we don't it will leak into the following test, as
      // `message` window events are delayed.
      await messageSeq('rendererReady');
    });
  });
});

it('posts ready message on mount', async () => {
  const fixtures = {
    first: 'First fixture',
    second: 'Second fixture'
  };

  await mockPostMessage(async ({ lastMessage, messageSeq }) => {
    await mountFixtureConnect(fixtures, async () => {
      await messageSeq('rendererReady');

      expect(lastMessage()).toEqual({
        type: 'rendererReady',
        payload: {
          rendererId: expect.any(String),
          fixtures: ['first', 'second']
        }
      });
    });
  });
});

it('posts ready message again on remote request', async () => {
  const fixtures = {
    first: 'First fixture',
    second: 'Second fixture'
  };

  await mockPostMessage(async ({ lastMessage, messageSeq, postMessage }) => {
    await mountFixtureConnect(fixtures, async () => {
      await messageSeq('rendererReady');

      await postMessage({
        type: 'remoteReady'
      });

      // No `fixtureState` event was fired because the fixtures used are
      // string nodes without props or state
      await messageSeq('rendererReady', 'remoteReady', 'rendererReady');

      expect(lastMessage()).toEqual({
        type: 'rendererReady',
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

  await mockPostMessage(async ({ messageSeq, postMessage }) => {
    await mountFixtureConnect(fixtures, async ({ instance }) => {
      await messageSeq('rendererReady');

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

  await mockPostMessage(async ({ postMessage, messageSeq }) => {
    await mountFixtureConnect(fixtures, async ({ instance }) => {
      await messageSeq('rendererReady');

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

  await mockPostMessage(async ({ postMessage, messageSeq }) => {
    await mountFixtureConnect(fixtures, async ({ instance }) => {
      await messageSeq('rendererReady');

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

  await mockPostMessage(async ({ lastMessage, messageSeq, postMessage }) => {
    await mountFixtureConnect(fixtures, async ({ instance }) => {
      await messageSeq('rendererReady');

      await postMessage({
        type: 'selectFixture',
        payload: {
          rendererId,
          fixturePath: 'first'
        }
      });

      expect(instance.toJSON()).toBe('Hello Bianca');

      await messageSeq('rendererReady', 'selectFixture', 'fixtureState');

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

      const { fixtureState } = lastMessage().payload;
      const [{ instanceId }] = getProps(fixtureState);
      await postMessage({
        type: 'setFixtureState',
        payload: {
          rendererId,
          fixturePath: 'first',
          fixtureState: setProps(fixtureState, instanceId, {
            name: 'B'
          })
        }
      });

      await messageSeq(
        'rendererReady',
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

// End of tests

// TODO: Use react-test-renderer types
type mountArgs = { instance: Object };

async function mountFixtureConnect(fixtures, children: mountArgs => mixed) {
  expect.hasAssertions();

  const instance = create(
    <PostMessage>
      {({ subscribe, unsubscribe, postMessage }) => (
        <FixtureConnect
          rendererId={rendererId}
          fixtures={fixtures}
          subscribe={subscribe}
          unsubscribe={unsubscribe}
          postMessage={postMessage}
        />
      )}
    </PostMessage>
  );

  try {
    await children({ instance });
  } finally {
    instance.unmount();
  }
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
