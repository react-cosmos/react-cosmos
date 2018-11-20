// @flow

import React from 'react';
import { wait, render, cleanup } from 'react-testing-library';
import { Slot } from 'react-plugin';
import { PlaygroundProvider } from '../../../PlaygroundProvider';
import { OnEvent } from '../../../testHelpers/OnEvent';
import { SetPluginState } from '../../../testHelpers/SetPluginState';
import { OnPluginState } from '../../../testHelpers/OnPluginState';
import { CallMethod } from '../../../testHelpers/CallMethod';
import { fixtures } from '../testHelpers';

// Plugins have side-effects: they register themselves
import '..';

afterEach(cleanup);

const renderersState = {
  primaryRendererId: 'foo-renderer',
  renderers: {
    'foo-renderer': {
      fixtures,
      fixtureState: null
    },
    'bar-renderer': {
      fixtures,
      fixtureState: null
    }
  }
};

const fixtureState = { components: [] };

it('sets fixture state for all renderers', async () => {
  const handleSetRenderersState = jest.fn();
  renderPlayground(
    <>
      <OnPluginState stateKey="renderers" handler={handleSetRenderersState} />
      <SetPluginState
        stateKey="urlParams"
        value={{ fixturePath: 'fixtures/zwei.js' }}
      />
      <SetPluginState stateKey="renderers" value={renderersState} />
      <CallMethod methodName="renderer.setFixtureState" args={[fixtureState]} />
    </>
  );

  await wait(() =>
    expect(handleSetRenderersState).toBeCalledWith(
      expect.objectContaining({
        renderers: {
          'foo-renderer': expect.objectContaining({
            fixtureState
          }),
          'bar-renderer': expect.objectContaining({
            fixtureState
          })
        }
      })
    )
  );
});

it('posts "setFixtureState" renderer requests', async () => {
  const handleRendererRequest = jest.fn();
  renderPlayground(
    <>
      <OnEvent eventName="renderer.request" handler={handleRendererRequest} />
      <SetPluginState
        stateKey="urlParams"
        value={{ fixturePath: 'fixtures/zwei.js' }}
      />
      <SetPluginState stateKey="renderers" value={renderersState} />
      <CallMethod methodName="renderer.setFixtureState" args={[fixtureState]} />
    </>
  );

  await wait(() =>
    expect(handleRendererRequest).toBeCalledWith({
      type: 'setFixtureState',
      payload: {
        rendererId: 'foo-renderer',
        fixturePath: 'fixtures/zwei.js',
        fixtureState
      }
    })
  );

  await wait(() =>
    expect(handleRendererRequest).toBeCalledWith({
      type: 'setFixtureState',
      payload: {
        rendererId: 'bar-renderer',
        fixturePath: 'fixtures/zwei.js',
        fixtureState
      }
    })
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
