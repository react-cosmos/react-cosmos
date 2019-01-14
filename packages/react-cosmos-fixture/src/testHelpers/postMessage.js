/* eslint-env browser */
// @flow

import React from 'react';
import {
  createFixtureConnectRenderCallback,
  getFixtureStateFromLastChange,
  untilLastMessageEquals,
  postSelectFixture,
  postUnselectFixture,
  postSetFixtureState
} from './shared';
import { PostMessage } from '..';

import type { ConnectMockApi } from './shared';

export async function mockConnect(children: ConnectMockApi => Promise<mixed>) {
  const onMessage = jest.fn();

  function getMessages() {
    return onMessage.mock.calls.map(call => call[0].data);
  }

  async function getFxStateFromLastChange() {
    return getFixtureStateFromLastChange(getMessages);
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

  window.addEventListener('message', onMessage, false);
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
    window.removeEventListener('message', onMessage);
  }
}

function getElement(userProps) {
  return (
    <PostMessage>{createFixtureConnectRenderCallback(userProps)}</PostMessage>
  );
}
