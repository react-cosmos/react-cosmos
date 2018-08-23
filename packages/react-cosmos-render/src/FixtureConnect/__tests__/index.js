// @flow

import React from 'react';
import { create } from 'react-test-renderer';
import { FixtureConnect } from '..';

import type { RemoteMessage } from '../../types/messages';

type OnRemoteMessage = RemoteMessage => any;

it('renders blank state message', () => {
  const instance = create(
    <FixtureConnect
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
      fixtures={fixtures}
      subscribe={() => {}}
      unsubscribe={() => {}}
      postMessage={postMessage}
    />
  );

  expect(postMessage).toBeCalledWith({
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
      fixtures={fixtures}
      subscribe={handler => {
        msgHandler = handler;
      }}
      unsubscribe={() => {}}
      postMessage={postMessage}
    />
  );

  const postRemoteMsg = getMsgHandler(msgHandler);
  const rendererId = getRendererIdFromReadyMsg(postMessage);
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
  create(
    <FixtureConnect
      fixtures={fixtures}
      subscribe={handler => {
        msgHandler = handler;
      }}
      unsubscribe={() => {}}
      postMessage={postMessage}
    />
  );

  const postRemoteMsg = getMsgHandler(msgHandler);
  const rendererId = getRendererIdFromReadyMsg(postMessage);

  // TODO: Capture rendererError message (when error boundary is implemented)
  expect(() => {
    postRemoteMsg({
      type: 'selectFixture',
      payload: {
        rendererId,
        fixturePath: 'third'
      }
    });
  }).toThrow('Invalid fixture path third');
});

it('unsubscribes on unmount', () => {
  const unsubscribe = jest.fn();
  const instance = create(
    <FixtureConnect
      fixtures={{}}
      subscribe={() => {}}
      unsubscribe={unsubscribe}
      postMessage={() => {}}
    />
  );

  instance.unmount();
  expect(unsubscribe).toBeCalled();
});

// TODO: fixtureState message
// TODO: setFixtureState message

// End of tests

function getMsgHandler(msgHandler): OnRemoteMessage {
  if (!msgHandler) {
    throw new Error('FixtureConnect has not subscribed');
  }

  return msgHandler;
}

function getRendererIdFromReadyMsg(postMessage) {
  const [msg: PostMessage] = postMessage.mock.calls[0];

  if (msg.type !== 'rendererReady') {
    throw new Error(`First message is not 'rendererReady'`);
  }

  return msg.payload.rendererId;
}
