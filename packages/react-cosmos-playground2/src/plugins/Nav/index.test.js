// @flow
/* eslint-env browser */

import React from 'react';
import {
  render,
  cleanup,
  waitForElement,
  wait,
  fireEvent
} from 'react-testing-library';
import { Slot } from 'react-plugin';
import { PluginProvider } from '../../plugin';
import { RegisterMethod } from '../../testHelpers/RegisterMethod';
import { SetPluginState } from '../../testHelpers/SetPluginState';

// Plugins have side-effects: they register themselves
// "renderers" and "router" state is required for Nav plugin to work
import '../Renderer';
import '../Router';
import '.';

afterEach(cleanup);

const mockRenderersState = {
  primaryRendererId: 'foo-renderer',
  renderers: {
    'foo-renderer': {
      fixtures: ['fixtures/ein.js', 'fixtures/zwei.js', 'fixtures/drei.js'],
      fixtureState: null
    }
  }
};

it('renders fixture list from renderer state', async () => {
  const { getByText } = renderPlayground(
    <SetPluginState stateKey="renderer" value={mockRenderersState} />
  );

  await waitForElement(() => getByText(/ein/i));
  await waitForElement(() => getByText(/zwei/i));
  await waitForElement(() => getByText(/drei/i));
});

it('sets "fixturePath" router param on fixture click', async () => {
  const setUrlParams = jest.fn();
  const { getByText } = renderPlayground(
    <>
      <SetPluginState stateKey="renderer" value={mockRenderersState} />
      <RegisterMethod methodName="router.setUrlParams" handler={setUrlParams} />
    </>
  );

  fireEvent.click(getByText(/zwei/i));

  expect(setUrlParams).toBeCalledWith({
    fixturePath: 'fixtures/zwei.js'
  });
});

it('clears router params on home button click', async () => {
  const setUrlParams = jest.fn();
  const { getByText } = renderPlayground(
    <>
      <SetPluginState stateKey="renderer" value={mockRenderersState} />
      <SetPluginState
        stateKey="router"
        value={{ urlParams: { fixturePath: 'fixtures/zwei.js' } }}
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
      <SetPluginState stateKey="renderer" value={mockRenderersState} />
      <SetPluginState
        stateKey="router"
        value={{ urlParams: { fixturePath: 'fixtures/zwei.js' } }}
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
// conditions, and thus the validity of the "full screen" test
it('renders nav element', async () => {
  const { queryByTestId } = renderPlayground(
    <SetPluginState stateKey="renderer" value={mockRenderersState} />
  );

  await wait(() => expect(queryByTestId('nav')).toBeTruthy());
});

it('does not render nav element in full screen mode', async () => {
  const { queryByTestId } = renderPlayground(
    <>
      <SetPluginState stateKey="renderer" value={mockRenderersState} />
      <SetPluginState
        stateKey="router"
        value={{
          urlParams: { fixturePath: 'fixtures/zwei.js', fullScreen: true }
        }}
      />
    </>
  );

  // Make sure the nav element doesn't appear after in next event loops
  await new Promise(res => setTimeout(res, 300));

  expect(queryByTestId('nav')).toBeNull();
});

function renderPlayground(otherNodes) {
  return render(
    <PluginProvider
      config={{
        projectId: 'mockProjectId',
        fixturesDir: 'fixtures'
      }}
    >
      <Slot name="left" />
      {otherNodes}
    </PluginProvider>
  );
}
