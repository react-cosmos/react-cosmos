// @flow

import React from 'react';
import { create } from 'react-test-renderer';
import { getProps, setProps } from '../../shared/fixture-state';
import { uuid } from '../../shared/uuid';
import { FixtureConnect } from '..';

import type { RemoteMessage } from '../../types/messages';

type OnRemoteMessage = RemoteMessage => any;

const rendererId = uuid();

it('renders blank state message', () => {
  const instance = create(
    <FixtureConnect
      rendererId={rendererId}
      fixtures={{}}
      subscribe={() => {}}
      unsubscribe={() => {}}
      postMessage={() => {}}
    />
  );

  expect(instance.toJSON()).toEqual('No fixture loaded');
});

it('posts ready message on mount', () => {
  const fixtures = {
    first: 'First fixture',
    second: 'Second fixture'
  };
  const postMessage = jest.fn();

  create(
    <FixtureConnect
      rendererId={rendererId}
      fixtures={fixtures}
      subscribe={() => {}}
      unsubscribe={() => {}}
      postMessage={postMessage}
    />
  );

  expect(postMessage).lastCalledWith({
    type: 'rendererReady',
    payload: {
      rendererId: expect.any(String),
      fixtures: ['first', 'second']
    }
  });
});

it('posts ready message again on remote request', () => {
  const fixtures = {
    first: 'First fixture',
    second: 'Second fixture'
  };
  const postMessage = jest.fn();

  let msgHandler;
  create(
    <FixtureConnect
      rendererId={rendererId}
      fixtures={fixtures}
      subscribe={handler => {
        msgHandler = handler;
      }}
      unsubscribe={() => {}}
      postMessage={postMessage}
    />
  );

  const postRemoteMsg = getMsgHandler(msgHandler);
  postRemoteMsg({
    type: 'remoteReady'
  });

  expect(postMessage).nthCalledWith(2, {
    type: 'rendererReady',
    payload: {
      rendererId: expect.any(String),
      fixtures: ['first', 'second']
    }
  });
});

it('renders selected fixture', () => {
  const fixtures = {
    first: 'First fixture',
    second: 'Second fixture'
  };
  const postMessage = jest.fn();

  let msgHandler;
  const instance = create(
    <FixtureConnect
      rendererId={rendererId}
      fixtures={fixtures}
      subscribe={handler => {
        msgHandler = handler;
      }}
      unsubscribe={() => {}}
      postMessage={postMessage}
    />
  );

  const postRemoteMsg = getMsgHandler(msgHandler);
  postRemoteMsg({
    type: 'selectFixture',
    payload: {
      rendererId,
      fixturePath: 'first'
    }
  });

  expect(instance.toJSON()).toBe('First fixture');

  postRemoteMsg({
    type: 'selectFixture',
    payload: {
      rendererId,
      fixturePath: null
    }
  });

  expect(instance.toJSON()).toBe('No fixture loaded');
});

it('ignores select fixture message for different renderer', () => {
  const fixtures = {
    first: 'First fixture',
    second: 'Second fixture'
  };

  let msgHandler;
  const instance = create(
    <FixtureConnect
      rendererId={rendererId}
      fixtures={fixtures}
      subscribe={handler => {
        msgHandler = handler;
      }}
      unsubscribe={() => {}}
      postMessage={() => {}}
    />
  );

  const postRemoteMsg = getMsgHandler(msgHandler);
  postRemoteMsg({
    type: 'selectFixture',
    payload: {
      rendererId: 'foobar',
      fixturePath: 'first'
    }
  });

  expect(instance.toJSON()).toBe('No fixture loaded');
});

it('errors when selecting invalid fixture path', () => {
  const fixtures = {
    first: 'First fixture',
    second: 'Second fixture'
  };
  const postMessage = jest.fn();

  let msgHandler;
  // TODO: Wrap component in error boundry for nicer output
  create(
    <FixtureConnect
      rendererId={rendererId}
      fixtures={fixtures}
      subscribe={handler => {
        msgHandler = handler;
      }}
      unsubscribe={() => {}}
      postMessage={postMessage}
    />
  );

  const postRemoteMsg = getMsgHandler(msgHandler);
  expect(() => {
    postRemoteMsg({
      type: 'selectFixture',
      payload: {
        rendererId,
        fixturePath: 'third'
      }
    });
  }).toThrow();
});

// Warning: This test has a bunch of steps incorporated because I thought it's
// easier to follow the flow in a single run than in several tests with a lot
// of initial repetition
it('sets fixture state on selected fixture', () => {
  const MyComponent = ({ name }) => `Hello ${name}`;
  const fixtures = {
    first: <MyComponent name="Bianca" />
  };
  const postMessage = jest.fn();

  let msgHandler;
  const instance = create(
    <FixtureConnect
      rendererId={rendererId}
      fixtures={fixtures}
      subscribe={handler => {
        msgHandler = handler;
      }}
      unsubscribe={() => {}}
      postMessage={postMessage}
    />
  );

  const postRemoteMsg = getMsgHandler(msgHandler);
  postRemoteMsg({
    type: 'selectFixture',
    payload: {
      rendererId,
      fixturePath: 'first'
    }
  });

  expect(instance.toJSON()).toBe('Hello Bianca');

  expect(postMessage).lastCalledWith({
    type: 'fixtureState',
    payload: {
      rendererId,
      fixturePath: 'first',
      fixtureState: {
        props: [getPropsInstanceShape('Bianca')]
      }
    }
  });

  const { fixtureState } = instance.getInstance().state;
  const [{ instanceId }] = getProps(fixtureState);
  postRemoteMsg({
    type: 'setFixtureState',
    payload: {
      rendererId,
      fixturePath: 'first',
      fixtureState: setProps(fixtureState, instanceId, {
        name: 'B'
      })
    }
  });

  expect(instance.toJSON()).toBe('Hello B');

  expect(postMessage).lastCalledWith({
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

it('unsubscribes on unmount', () => {
  const unsubscribe = jest.fn();
  const instance = create(
    <FixtureConnect
      rendererId={rendererId}
      fixtures={{}}
      subscribe={() => {}}
      unsubscribe={unsubscribe}
      postMessage={() => {}}
    />
  );

  instance.unmount();
  expect(unsubscribe).toBeCalled();
});

// End of tests

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

function getMsgHandler(msgHandler): OnRemoteMessage {
  if (!msgHandler) {
    throw new Error('FixtureConnect has not subscribed');
  }

  return msgHandler;
}
