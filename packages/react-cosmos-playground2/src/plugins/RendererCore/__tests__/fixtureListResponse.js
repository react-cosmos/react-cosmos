// @flow

import React from 'react';
import { wait, render, cleanup } from 'react-testing-library';
import { Slot } from 'react-plugin';
import { PluginProvider } from '../../../plugin';
import { EmitEvent } from '../../../testHelpers/EmitEvent';
import { SetPluginState } from '../../../testHelpers/SetPluginState';
import { OnPluginState } from '../../../testHelpers/OnPluginState';
import {
  mockFixtureState,
  getFixtureListResponse,
  getRendererState
} from '../testHelpers';

// Plugins have side-effects: they register themselves
// "urlParams" state is required for RendererCore plugin to work
import '../../Router';
import '..';

afterEach(cleanup);

it('creates renderer state', async () => {
  const handleSetRenderersState = jest.fn();
  renderPlayground(
    <>
      <OnPluginState stateKey="renderers" handler={handleSetRenderersState} />
      <EmitEvent
        eventName="renderer.response"
        args={[getFixtureListResponse('foo-renderer')]}
      />
    </>
  );

  await wait(() =>
    expect(handleSetRenderersState).toBeCalledWith(
      expect.objectContaining({
        primaryRendererId: 'foo-renderer',
        renderers: {
          'foo-renderer': expect.objectContaining({
            fixtureState: null
          })
        }
      })
    )
  );
});

it('creates multiple renderer states', async () => {
  const handleSetRenderersState = jest.fn();
  renderPlayground(
    <>
      <OnPluginState stateKey="renderers" handler={handleSetRenderersState} />
      <EmitEvent
        eventName="renderer.response"
        args={[getFixtureListResponse('foo-renderer')]}
      />
      <EmitEvent
        eventName="renderer.response"
        args={[getFixtureListResponse('bar-renderer')]}
      />
    </>
  );

  await wait(() =>
    expect(handleSetRenderersState).toBeCalledWith(
      expect.objectContaining({
        primaryRendererId: 'foo-renderer',
        renderers: {
          'foo-renderer': expect.objectContaining({
            fixtureState: null
          }),
          'bar-renderer': expect.objectContaining({
            fixtureState: null
          })
        }
      })
    )
  );
});

it('creates renderer state with fixture state of primary renderer', async () => {
  const handleSetRenderersState = jest.fn();
  renderPlayground(
    <>
      <OnPluginState stateKey="renderers" handler={handleSetRenderersState} />
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
    expect(handleSetRenderersState).toBeCalledWith(
      expect.objectContaining({
        renderers: expect.objectContaining({
          'bar-renderer': expect.objectContaining({
            fixtureState: mockFixtureState
          })
        })
      })
    )
  );
});

function renderPlayground(otherNodes) {
  return render(
    <PluginProvider>
      <Slot name="global" />
      {otherNodes}
    </PluginProvider>
  );
}
