// @flow

import React from 'react';
import { wait, render, cleanup } from 'react-testing-library';
import { Slot } from 'react-plugin';
import { PlaygroundProvider } from '../../../PlaygroundProvider';
import { EmitEvent } from '../../../testHelpers/EmitEvent';
import { OnEvent } from '../../../testHelpers/OnEvent';
import { SetPluginState } from '../../../testHelpers/SetPluginState';
import { OnPluginState } from '../../../testHelpers/OnPluginState';
import {
  mockFixtureState,
  getRendererState,
  getFixtureStateChangeRequest
} from '../testHelpers';

// Plugins have side-effects: they register themselves
import '..';

afterEach(cleanup);

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
        args={[getFixtureStateChangeRequest('foo-renderer')]}
      />
    </>
  );

  await wait(() =>
    expect(handleSetRenderersState).toBeCalledWith(
      expect.objectContaining({
        renderers: {
          'foo-renderer': expect.objectContaining({
            fixtureState: mockFixtureState
          })
        }
      })
    )
  );
});

it('sets primary and secondary "fixtureState" renderer states', async () => {
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
            }),
            'bar-renderer': getRendererState({
              fixtureState: null
            })
          }
        }}
      />
      <EmitEvent
        eventName="renderer.response"
        args={[getFixtureStateChangeRequest('foo-renderer')]}
      />
    </>
  );

  await wait(() =>
    expect(handleSetRenderersState).toBeCalledWith(
      expect.objectContaining({
        renderers: {
          'foo-renderer': expect.objectContaining({
            fixtureState: mockFixtureState
          }),
          'bar-renderer': expect.objectContaining({
            fixtureState: mockFixtureState
          })
        }
      })
    )
  );
});

it('only sets secondary "fixtureState" renderer state', async () => {
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
            }),
            'bar-renderer': getRendererState({
              fixtureState: null
            })
          }
        }}
      />
      <EmitEvent
        eventName="renderer.response"
        args={[getFixtureStateChangeRequest('bar-renderer')]}
      />
    </>
  );

  await wait(() =>
    expect(handleSetRenderersState).toBeCalledWith(
      expect.objectContaining({
        renderers: {
          'foo-renderer': expect.objectContaining({
            fixtureState: null
          }),
          'bar-renderer': expect.objectContaining({
            fixtureState: mockFixtureState
          })
        }
      })
    )
  );
});

it('posts "setFixtureState" request to secondary renderer', async () => {
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
              fixtureState: null
            }),
            'bar-renderer': getRendererState({
              fixtureState: null
            })
          }
        }}
      />
      <EmitEvent
        eventName="renderer.response"
        args={[getFixtureStateChangeRequest('foo-renderer')]}
      />
    </>
  );

  await wait(() =>
    expect(handleRendererRequest).toBeCalledWith({
      type: 'setFixtureState',
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
