// @flow

import React from 'react';
import { wait, render, cleanup } from 'react-testing-library';
import { Slot } from 'react-plugin';
import { PlaygroundProvider } from '../../../PlaygroundProvider';
import { EmitEvent } from '../../../testHelpers/EmitEvent';
import { SetPluginState } from '../../../testHelpers/SetPluginState';
import { OnPluginState } from '../../../testHelpers/OnPluginState';

// Plugins have side-effects: they register themselves
import '..';

afterEach(cleanup);

const mockFixtureStateChangeMsg = {
  type: 'fixtureStateChange',
  payload: {
    rendererId: 'foo-renderer',
    fixturePath: 'fixtures/zwei.js',
    fixtureState: {
      components: []
    }
  }
};

it('sets "fixtureState" renderer state', async () => {
  const handleSetRenderersState = jest.fn();
  renderPlayground(
    <>
      <OnPluginState stateKey="renderers" handler={handleSetRenderersState} />
      <SetPluginState
        stateKey="urlParams"
        value={{ fixturePath: 'fixtures/zwei.js' }}
      />
      <SetPluginState
        stateKey="renderers"
        value={{
          primaryRendererId: 'foo-renderer',
          renderers: {
            'foo-renderer': getRendererState({
              fixtureState: null
            })
          }
        }}
      />
      <EmitEvent
        eventName="renderer.response"
        args={[mockFixtureStateChangeMsg]}
      />
    </>
  );

  await wait(() =>
    expect(handleSetRenderersState).toBeCalledWith(
      expect.objectContaining({
        renderers: {
          'foo-renderer': expect.objectContaining({
            fixtureState: {
              components: []
            }
          })
        }
      })
    )
  );
});

function renderPlayground(otherNodes) {
  return render(
    <PlaygroundProvider
      options={{
        rendererPreviewUrl: 'mockRendererUrl',
        enableRemoteRenderers: false
      }}
    >
      <Slot name="global" />
      {otherNodes}
    </PlaygroundProvider>
  );
}

function getRendererState({ fixtureState }) {
  return {
    fixtures: ['fixtures/ein.js', 'fixtures/zwei.js', 'fixtures/drei.js'],
    fixtureState
  };
}
