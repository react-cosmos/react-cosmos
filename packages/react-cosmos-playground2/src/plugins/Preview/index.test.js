// @flow

import React from 'react';
import { wait, render } from 'react-testing-library';
import { Slot } from 'react-plugin';
import { PlaygroundContext, defaultUiState } from '../../context';

// Plugins have side-effects: they register themselves
import '.';

import type { PlaygroundContextValue } from '../../index.js.flow';

it('renders iframe with options.rendererUrl src', () => {
  const renderer = renderSlot();

  expect(getIframe(renderer)).toBeTruthy();
  expect(getIframe(renderer).src).toMatch('foo-renderer');
});

it('subscribes to renderer requests', async () => {
  const onRendererRequest = jest.fn();
  renderSlot({ onRendererRequest });

  await wait(() => expect(onRendererRequest).toBeCalled());
});

function renderSlot({
  setUiState = () => {},
  replaceFixtureState = () => {},
  postRendererRequest = () => {},
  onRendererRequest = () => () => {}
}: $Shape<PlaygroundContextValue> = {}) {
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
