// @flow

import React from 'react';
// $FlowFixMe __getMockApi is defined in __mocks__/socket.io-client
import { __getMockApi } from 'socket.io-client';
import { WebSockets } from '..';
import {
  createFixtureConnectRenderCallback,
  getFixtureStateFromLastChange,
  untilLastMessageEquals,
  postSelectFixture,
  postUnselectFixture,
  postSetFixtureState
} from './shared';

import type { ConnectMockApi } from './shared';

const { WS_URL, getMessages, postMessage, resetMessages } = __getMockApi();

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

function getElement(userProps) {
  return (
    <WebSockets url={WS_URL}>
      {createFixtureConnectRenderCallback(userProps)}
    </WebSockets>
  );
}
