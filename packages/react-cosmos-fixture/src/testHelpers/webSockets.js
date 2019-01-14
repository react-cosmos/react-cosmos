// @flow

import React from 'react';
import {
  mockUrl,
  getMessages,
  postMessage,
  resetMessages
} from './webSocketsMock';
import {
  createFixtureConnectRenderCallback,
  getFixtureStateFromLastChange,
  untilLastMessageEquals,
  postSelectFixture,
  postUnselectFixture,
  postSetFixtureState
} from './shared';
import { WebSockets } from '..';

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

function getElement(userProps) {
  return (
    <WebSockets url={mockUrl}>
      {createFixtureConnectRenderCallback(userProps)}
    </WebSockets>
  );
}
