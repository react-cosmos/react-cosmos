// @flow
/* eslint-env browser */

import React from 'react';
import {
  render,
  cleanup,
  waitForElement,
  fireEvent
} from 'react-testing-library';
import { Slot } from 'react-plugin';
import { PlaygroundProvider } from '../../PlaygroundProvider';
import { RegisterMethod } from '../../testHelpers/RegisterMethod';
import { SetPluginState } from '../../testHelpers/SetPluginState';

// Plugins have side-effects: they register themselves
import '.';

afterEach(cleanup);

const mockRendererState = {
  rendererIds: ['foo-renderer'],
  fixtures: ['fixtures/ein.js', 'fixtures/zwei.js', 'fixtures/drei.js']
};

it('renders fixture list from renderer state', async () => {
  const { getByText } = renderPlayground(
    <SetPluginState pluginName="renderer" state={mockRendererState} />
  );

  await waitForElement(() => getByText(/ein/i));
  await waitForElement(() => getByText(/zwei/i));
  await waitForElement(() => getByText(/drei/i));
});

it('sets "fixturePath" router param on fixture click', async () => {
  const setUrlParams = jest.fn();
  const { getByText } = renderPlayground(
    <>
      <SetPluginState pluginName="renderer" state={mockRendererState} />
      <RegisterMethod methodName="router.setUrlParams" handler={setUrlParams} />
    </>
  );

  fireEvent.click(getByText(/zwei/i));

  expect(setUrlParams).toBeCalledWith({ fixturePath: 'fixtures/zwei.js' });
});

it('clears router params on home button click', async () => {
  const setUrlParams = jest.fn();
  const { getByText } = renderPlayground(
    <>
      <SetPluginState pluginName="renderer" state={mockRendererState} />
      <SetPluginState
        pluginName="urlParams"
        state={{ fixturePath: 'fixtures/zwei.js' }}
      />
      <RegisterMethod methodName="router.setUrlParams" handler={setUrlParams} />
    </>
  );

  fireEvent.click(getByText(/home/i));

  expect(setUrlParams).toBeCalledWith({});
});

it('sets "fullScreen" router param on fullscreen button click', () => {
  const setUrlParams = jest.fn();
  const { getByText } = renderPlayground(
    <>
      <SetPluginState pluginName="renderer" state={mockRendererState} />
      <SetPluginState
        pluginName="urlParams"
        state={{ fixturePath: 'fixtures/zwei.js' }}
      />
      <RegisterMethod methodName="router.setUrlParams" handler={setUrlParams} />
    </>
  );

  fireEvent.click(getByText(/fullscreen/i));

  expect(setUrlParams).toBeCalledWith({
    fixturePath: 'fixtures/zwei.js',
    fullScreen: true
  });
});

// This test confirms the existence of the "nav" element under normal
// conditions, and thus validity of the "full screen" test.
it('renders nav element', () => {
  const { queryByTestId } = renderPlayground();

  expect(queryByTestId('nav')).toBeTruthy();
});

it('does not render nav element in full screen mode', async () => {
  const { queryByTestId } = renderPlayground(
    <SetPluginState
      pluginName="urlParams"
      state={{ fixturePath: 'fixtures/zwei.js', fullScreen: true }}
    />
  );

  expect(queryByTestId('nav')).toBeNull();
});

function renderPlayground(otherNodes) {
  return render(
    <PlaygroundProvider
      options={{
        rendererPreviewUrl: 'mockRendererUrl',
        enableRemoteRenderers: false
      }}
    >
      <Slot name="left" />
      {otherNodes}
    </PlaygroundProvider>
  );
}
