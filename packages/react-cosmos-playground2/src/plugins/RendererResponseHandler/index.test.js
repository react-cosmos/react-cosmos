// @flow

import React from 'react';
import { wait, render, cleanup } from 'react-testing-library';
import { Slot } from 'react-plugin';
import { PlaygroundProvider } from '../../PlaygroundProvider';
import { EmitEvent } from '../../testHelpers/EmitEvent';
import { OnPluginState } from '../../testHelpers/OnPluginState';

// Plugins have side-effects: they register themselves
import '.';

afterEach(cleanup);

const mockRendererId = 'foo-renderer';

const mockFixtureListMsg = {
  type: 'fixtureList',
  payload: {
    rendererId: mockRendererId,
    fixtures: ['fixtures/ein.js', 'fixtures/zwei.js', 'fixtures/drei.js']
  }
};

const mockFixtureStateMsg = {
  type: 'fixtureState',
  payload: {
    rendererId: mockRendererId,
    fixturePath: 'fixtures/zwei.js',
    fixtureState: {
      components: []
    }
  }
};

it('sets "rendererIds" renderer state on "fixtureList" renderer response', async () => {
  const handleSetRendererState = jest.fn();
  renderPlayground(
    <>
      <OnPluginState pluginName="renderer" handler={handleSetRendererState} />
      <EmitEvent eventName="renderer.response" args={[mockFixtureListMsg]} />
    </>
  );

  await wait(() =>
    expect(handleSetRendererState).toBeCalledWith(
      expect.objectContaining({
        rendererIds: [mockRendererId]
      })
    )
  );
});

it('sets "fixtures" renderer state on "fixtureList" renderer response', async () => {
  const handleSetRendererState = jest.fn();
  renderPlayground(
    <>
      <OnPluginState pluginName="renderer" handler={handleSetRendererState} />
      <EmitEvent eventName="renderer.response" args={[mockFixtureListMsg]} />
    </>
  );

  await wait(() =>
    expect(handleSetRendererState).toBeCalledWith(
      expect.objectContaining({
        fixtures: ['fixtures/ein.js', 'fixtures/zwei.js', 'fixtures/drei.js']
      })
    )
  );
});

it('sets "fixtureState" renderer state on "fixtureState" renderer response', async () => {
  const handleSetRendererState = jest.fn();
  renderPlayground(
    <>
      <OnPluginState pluginName="renderer" handler={handleSetRendererState} />
      <EmitEvent eventName="renderer.response" args={[mockFixtureListMsg]} />
      <EmitEvent eventName="renderer.response" args={[mockFixtureStateMsg]} />
    </>
  );

  await wait(() =>
    expect(handleSetRendererState).toBeCalledWith(
      expect.objectContaining({
        fixtureState: {
          components: []
        }
      })
    )
  );
});

function renderPlayground(otherNodes) {
  return render(
    <PlaygroundProvider
      options={{
        rendererUrl: 'mockRendererUrl'
      }}
    >
      <Slot name="global" />
      {otherNodes}
    </PlaygroundProvider>
  );
}
