// @flow

import React from 'react';
import { wait, waitForElement, render, cleanup } from 'react-testing-library';
import { Slot } from 'react-plugin';
import { PlaygroundProvider } from '../../PlaygroundProvider';
import { EmitEvent } from '../../testHelpers/EmitEvent';
import { OnPluginState } from '../../testHelpers/OnPluginState';
import { registerTestPlugin } from '../../testHelpers/testPlugin';

// Plugins have side-effects: they register themselves
require('.');
registerTestPlugin('root');

afterEach(cleanup);

it('renders "root" slot', async () => {
  const { getByTestId } = renderPlayground();

  await waitForElement(() => getByTestId('test-plugin'));
});

it('renders content from "root" slot', async () => {
  const { getByText } = renderPlayground();

  await waitForElement(() => getByText(/content renderered by other plugins/i));
});

it('adds rendererIds to state on "fixtureList" renderer response', async () => {
  const handlePluginState = jest.fn();
  renderPlayground(
    <>
      <OnPluginState pluginName="renderer" handler={handlePluginState} />
      <EmitEvent eventName="renderer.response" args={[mockFixtureListMsg]} />
    </>
  );

  await wait(() =>
    expect(handlePluginState).toBeCalledWith(
      expect.objectContaining({
        rendererIds: [mockRendererId]
      })
    )
  );
});

it('adds fixtures to state on "fixtureList" renderer response', async () => {
  const handlePluginState = jest.fn();
  renderPlayground(
    <>
      <OnPluginState pluginName="renderer" handler={handlePluginState} />
      <EmitEvent eventName="renderer.response" args={[mockFixtureListMsg]} />
    </>
  );

  await wait(() =>
    expect(handlePluginState).toBeCalledWith(
      expect.objectContaining({
        fixtures: mockFixtures
      })
    )
  );
});

it('adds fixture state to state on "fixtureState" renderer response', async () => {
  const handlePluginState = jest.fn();
  renderPlayground(
    <>
      <OnPluginState pluginName="renderer" handler={handlePluginState} />
      <EmitEvent eventName="renderer.response" args={[mockFixtureListMsg]} />
      <EmitEvent eventName="renderer.response" args={[mockFixtureStateMsg]} />
    </>
  );

  await wait(() =>
    expect(handlePluginState).toBeCalledWith(
      expect.objectContaining({
        fixtureState: mockFixtureState
      })
    )
  );
});

const mockRendererId = 'foo-renderer';

const mockFixtures = [
  'fixtures/ein.js',
  'fixtures/zwei.js',
  'fixtures/drei.js'
];

const mockFixtureListMsg = {
  type: 'fixtureList',
  payload: {
    rendererId: mockRendererId,
    fixtures: mockFixtures
  }
};

const mockFixtureState = {
  components: []
};

const mockFixtureStateMsg = {
  type: 'fixtureState',
  payload: {
    rendererId: mockRendererId,
    fixturePath: mockFixtures[1],
    fixtureState: mockFixtureState
  }
};

function renderPlayground(otherNodes) {
  return render(
    <PlaygroundProvider
      options={{
        rendererUrl: 'foo-renderer'
      }}
    >
      <Slot name="root">Content renderered by other plugins</Slot>
      {otherNodes}
    </PlaygroundProvider>
  );
}
