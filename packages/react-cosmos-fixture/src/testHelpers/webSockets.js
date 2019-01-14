// @flow

import React from 'react';
import {
  getFixtureStateFromLastChange,
  untilLastMessageEquals,
  postSelectFixture,
  postUnselectFixture,
  postSetFixtureState
} from '../testHelpers/shared';
import {
  mockUrl,
  getMessages,
  postMessage,
  resetMessages
} from './webSocketsMock';
import { WebSockets, FixtureConnect } from '..';

import type { ConnectMockApi } from './shared';

export async function mockConnect(children: ConnectMockApi => Promise<mixed>) {
  async function getFxStateFromLastChange() {
    return getFixtureStateFromLastChange(getMessages);
  }

  async function untilMessage(msg) {
    return untilLastMessageEquals(() => getMessages(), msg);
  }

  async function selectFixture({ rendererId, fixturePath, fixtureState }) {
    return postSelectFixture(postMessage, {
      rendererId,
      fixturePath,
      fixtureState
    });
  }

  async function unselectFixture({ rendererId }) {
    return postUnselectFixture(postMessage, {
      rendererId
    });
  }

  async function setFixtureState({ rendererId, fixturePath, fixtureState }) {
    return postSetFixtureState(postMessage, {
      rendererId,
      fixturePath,
      fixtureState
    });
  }

  try {
    await children({
      getElement,
      untilMessage,
      getFxStateFromLastChange,
      postMessage,
      selectFixture,
      unselectFixture,
      setFixtureState
    });
  } finally {
    resetMessages();
  }
}

function getElement({ rendererId, fixtures, decorators, onFixtureChange }) {
  return (
    <WebSockets url={mockUrl}>
      {({ subscribe, unsubscribe, postMessage }) => (
        <FixtureConnect
          rendererId={rendererId}
          fixtures={fixtures}
          systemDecorators={[]}
          userDecorators={decorators}
          onFixtureChange={onFixtureChange}
          subscribe={subscribe}
          unsubscribe={unsubscribe}
          postMessage={postMessage}
        />
      )}
    </WebSockets>
  );
}
