// @flow

import React from 'react';
import { create as render } from 'react-test-renderer';
import { Slot } from 'react-plugin';
import { PlaygroundContext, defaultUiState } from '../../context';

// Plugins have side-effects: they register themselves
import '.';

it('renders iframe with options.rendererUrl src', () => {
  const renderer = renderSlot();

  expect(getIframe(renderer)).toBeTruthy();
  expect(getIframe(renderer).props.src).toBe('foo-renderer');
});

function renderSlot() {
  const setUiState = jest.fn();
  const replaceFixtureState = jest.fn();
  const postRendererRequest = jest.fn();
  const onRendererRequest = jest.fn();

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

function getIframe(renderer) {
  return renderer.root.findByType('iframe');
}
