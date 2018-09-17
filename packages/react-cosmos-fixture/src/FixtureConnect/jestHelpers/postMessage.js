/* eslint-env browser, jest */
/* istanbul ignore file */
// @flow

import React from 'react';
import {
  getLastFixtureState,
  untilLastMessageEquals,
  postSelectFixture,
  postSetFixtureState
} from '../jestHelpers/shared';
import { PostMessage } from '../PostMessage';
import { FixtureConnect } from '..';

import type { ConnectMockApi } from './shared';

export async function mockConnect(children: ConnectMockApi => Promise<mixed>) {
  const onMessage = jest.fn();

  function getMessages() {
    return onMessage.mock.calls.map(call => call[0].data);
  }

  async function lastFixtureState() {
    return getLastFixtureState(getMessages);
  }

  async function untilMessage(msg) {
    return untilLastMessageEquals(getMessages, msg);
  }

  async function postMessage(msg) {
    parent.postMessage(msg, '*');

    // This is very convenient because we don't have to await manually for each
    // dispatched event to be fulfilled inside test cases
    await untilMessage(msg);
  }

  async function selectFixture({ rendererId, fixturePath }) {
    return postSelectFixture(postMessage, {
      rendererId,
      fixturePath
    });
  }

  async function setFixtureState({
    rendererId,
    fixturePath,
    fixtureStateChange
  }) {
    return postSetFixtureState(postMessage, {
      rendererId,
      fixturePath,
      fixtureStateChange
    });
  }

  window.addEventListener('message', onMessage, false);
  try {
    await children({
      getElement,
      untilMessage,
      lastFixtureState,
      postMessage,
      selectFixture,
      setFixtureState
    });
  } finally {
    window.removeEventListener('message', onMessage);
  }
}

function getElement(props) {
  return (
    <PostMessage>
      {({ subscribe, unsubscribe, postMessage }) => (
        <FixtureConnect
          {...props}
          subscribe={subscribe}
          unsubscribe={unsubscribe}
          postMessage={postMessage}
        />
      )}
    </PostMessage>
  );
}
