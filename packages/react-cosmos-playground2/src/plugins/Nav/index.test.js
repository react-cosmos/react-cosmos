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

it('renders fixture list received from renderer', async () => {
  const { queryByTestId, getByText } = renderPlayground();

  expect(queryByTestId('nav')).toBeTruthy();

  await waitForElement(() => getByText(/ein/i));
  await waitForElement(() => getByText(/zwei/i));
  await waitForElement(() => getByText(/drei/i));
});

it('pushes fixture path to URL on fixture click', async () => {
  const setUrlParams = jest.fn();
  const { getByText } = renderPlayground(
    <RegisterMethod methodName="router.setUrlParams" handler={setUrlParams} />
  );

  // waitForElement is needed because the fixture list isn't shown immediately
  fireEvent.click(await waitForElement(() => getByText(/zwei/i)));

  expect(setUrlParams).toBeCalledWith({ fixture: 'fixtures/zwei.js' });
});

it('calls "router.setUrlParams" with blank params on home button', async () => {
  const setUrlParams = jest.fn();
  const { getByText } = renderPlayground(
    <>
      <SetPluginState
        pluginName="router"
        state={{ fixture: 'fixtures/zwei.js' }}
      />
      <RegisterMethod methodName="router.setUrlParams" handler={setUrlParams} />
    </>
  );

  fireEvent.click(getByText(/home/i));

  expect(setUrlParams).toBeCalledWith({});
});

it('calls "router.setUrlParams" on fullscreen button', () => {
  const setUrlParams = jest.fn();
  const { getByText } = renderPlayground(
    <>
      <SetPluginState
        pluginName="router"
        state={{ fixture: 'fixtures/zwei.js' }}
      />
      <RegisterMethod methodName="router.setUrlParams" handler={setUrlParams} />
    </>
  );

  fireEvent.click(getByText(/fullscreen/i));

  expect(setUrlParams).toBeCalledWith({
    fixture: 'fixtures/zwei.js',
    fullscreen: true
  });
});

it('does not render in full screen mode', async () => {
  const { queryByTestId } = renderPlayground(
    <SetPluginState
      pluginName="router"
      state={{ fixture: 'fixtures/zwei.js', fullscreen: true }}
    />
  );

  expect(queryByTestId('nav')).toBeNull();
});

const mockRendererState = {
  rendererIds: ['foo-renderer'],
  fixtures: ['fixtures/ein.js', 'fixtures/zwei.js', 'fixtures/drei.js']
};

function renderPlayground(otherNodes) {
  return render(
    <PlaygroundProvider
      options={{
        rendererUrl: 'foo-renderer'
      }}
    >
      <Slot name="left" />
      <SetPluginState pluginName="renderer" state={mockRendererState} />
      {otherNodes}
    </PlaygroundProvider>
  );
}
