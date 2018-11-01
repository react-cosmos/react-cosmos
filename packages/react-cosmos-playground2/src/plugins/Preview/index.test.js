// @flow

import React from 'react';
import { wait, render, cleanup } from 'react-testing-library';
import { Slot } from 'react-plugin';
import { PlaygroundContext, defaultUiState } from '../../context';

// Plugins have side-effects: they register themselves
import '.';

import type { PlaygroundContextValue } from '../../index.js.flow';

afterEach(cleanup);

it('renders iframe with options.rendererUrl src', () => {
  const renderer = renderSlot();

  expect(getIframe(renderer)).toBeTruthy();
  expect(getIframe(renderer).src).toMatch('foo-renderer');
});

it('subscribes to renderer requests', async () => {
  const onRendererRequest = jest.fn();
  renderSlot({ onRendererRequest });

  await wait(() =>
    expect(onRendererRequest).toBeCalledWith(expect.any(Function))
  );
});

it('posts renderer request message to iframe', async () => {
  const selectFixtureMsg = {
    type: 'selectFixture',
    payload: {
      rendererId: 'foo-rendererId',
      fixturePath: 'bar-fixturePath'
    }
  };

  let requestListener;
  const renderer = renderSlot({
    onRendererRequest: listener => {
      requestListener = listener;

      // Return unsubscribe function
      return () => {};
    }
  });

  const iframe = getIframe(renderer);

  await mockIframeMessage(iframe, async ({ onMessage }) => {
    requestListener(selectFixtureMsg);

    await wait(() => expect(onMessage).toBeCalled());

    const firstCall = onMessage.mock.calls[0];
    expect(firstCall[0].data).toEqual(selectFixtureMsg);
  });
});

function renderSlot({
  setUiState = () => {},
  replaceFixtureState = () => {},
  postRendererRequest = () => {},
  onRendererRequest = () => () => {}
}: $Shape<PlaygroundContextValue> = {}) {
  // TODO: Render Root instead
  return render(
    <PlaygroundContext.Provider
      value={{
        options: {
          rendererUrl: 'foo-renderer'
        },
        uiState: defaultUiState,
        fixtureState: null,
        setUiState,
        replaceFixtureState,
        postRendererRequest,
        onRendererRequest
      }}
    >
      <Slot name="preview" />
    </PlaygroundContext.Provider>
  );
}

function getIframe({ getByTestId }) {
  return getByTestId('preview-iframe');
}

async function mockIframeMessage(iframe, children) {
  const { contentWindow } = iframe;
  const onMessage = jest.fn();

  try {
    contentWindow.addEventListener('message', onMessage, false);
    await children({ onMessage });
  } catch (err) {
    // Make errors visible
    throw err;
  } finally {
    contentWindow.removeEventListener('message', onMessage);
  }
}
