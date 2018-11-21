// @flow

import React from 'react';
import { wait, render, cleanup } from 'react-testing-library';
import { Slot } from 'react-plugin';
import { PlaygroundProvider } from '../../../PlaygroundProvider';
import { EmitEvent } from '../../../testHelpers/EmitEvent';
import { OnEvent } from '../../../testHelpers/OnEvent';
import { SetPluginState } from '../../../testHelpers/SetPluginState';
import {
  mockFixtureState,
  getFixtureListResponse,
  getRendererState
} from '../testHelpers';

// Plugins have side-effects: they register themselves
import '..';

afterEach(cleanup);

it('posts "selectFixture" renderer request', async () => {
  const handleRendererRequest = jest.fn();
  renderPlayground(
    <>
      <OnEvent eventName="renderer.request" handler={handleRendererRequest} />
      <SetPluginState
        stateKey="urlParams"
        value={{ fixturePath: 'fixtures/zwei.js' }}
      />
      <EmitEvent
        eventName="renderer.response"
        args={[getFixtureListResponse('foo-renderer')]}
      />
    </>
  );

  await wait(() =>
    expect(handleRendererRequest).toBeCalledWith({
      type: 'selectFixture',
      payload: {
        rendererId: 'foo-renderer',
        fixturePath: 'fixtures/zwei.js',
        fixtureState: null
      }
    })
  );
});

it('posts "selectFixture" renderer request with fixture state of primary renderer', async () => {
  const handleRendererRequest = jest.fn();
  renderPlayground(
    <>
      <OnEvent eventName="renderer.request" handler={handleRendererRequest} />
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
              fixtureState: mockFixtureState
            })
          }
        }}
      />
      <EmitEvent
        eventName="renderer.response"
        args={[getFixtureListResponse('bar-renderer')]}
      />
    </>
  );

  await wait(() =>
    expect(handleRendererRequest).toBeCalledWith({
      type: 'selectFixture',
      payload: {
        rendererId: 'bar-renderer',
        fixturePath: 'fixtures/zwei.js',
        fixtureState: mockFixtureState
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
