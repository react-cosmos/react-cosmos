// @flow

import React from 'react';
import { wait, render, cleanup } from 'react-testing-library';
import { Slot } from 'react-plugin';
import { PlaygroundProvider } from '../../PlaygroundProvider';
import { EmitEvent } from '../../testHelpers/EmitEvent';
import { OnEvent } from '../../testHelpers/OnEvent';
import { SetPluginState } from '../../testHelpers/SetPluginState';
import { OnPluginState } from '../../testHelpers/OnPluginState';

// Plugins have side-effects: they register themselves
import '.';

afterEach(cleanup);

it('sets "rendererIds" renderer state on "fixtureList" renderer response', async () => {
  const handleSetRendererState = jest.fn();
  renderPlayground(
    <>
      <OnPluginState pluginName="renderer" handler={handleSetRendererState} />
      <EmitEvent
        eventName="renderer.response"
        args={[getFixtureListResponse('foo-renderer')]}
      />
    </>
  );

  await wait(() =>
    expect(handleSetRendererState).toBeCalledWith(
      expect.objectContaining({
        rendererIds: ['foo-renderer']
      })
    )
  );
});

it('sets "fixtures" renderer state on "fixtureList" renderer response', async () => {
  const handleSetRendererState = jest.fn();
  renderPlayground(
    <>
      <OnPluginState pluginName="renderer" handler={handleSetRendererState} />
      <EmitEvent
        eventName="renderer.response"
        args={[getFixtureListResponse('foo-renderer')]}
      />
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

it('sets "fixtureState" renderer state on "fixtureStateSync" renderer response', async () => {
  const mockFixtureStateChangeMsg = {
    type: 'fixtureStateSync',
    payload: {
      rendererId: 'foo-renderer',
      fixturePath: 'fixtures/zwei.js',
      fixtureState: {
        components: []
      }
    }
  };

  const handleSetRendererState = jest.fn();
  renderPlayground(
    <>
      <OnPluginState pluginName="renderer" handler={handleSetRendererState} />
      <SetPluginState
        pluginName="urlParams"
        state={{ fixturePath: 'fixtures/zwei.js' }}
      />
      <EmitEvent
        eventName="renderer.response"
        args={[getFixtureListResponse('foo-renderer')]}
      />
      <EmitEvent
        eventName="renderer.response"
        args={[mockFixtureStateChangeMsg]}
      />
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

describe('on "fixtureStateChange" renderer response', () => {
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
    const handleSetRendererState = jest.fn();
    renderPlayground(
      <>
        <OnPluginState pluginName="renderer" handler={handleSetRendererState} />
        <SetPluginState
          pluginName="urlParams"
          state={{ fixturePath: 'fixtures/zwei.js' }}
        />
        <EmitEvent
          eventName="renderer.response"
          args={[getFixtureListResponse('foo-renderer')]}
        />
        <EmitEvent
          eventName="renderer.response"
          args={[mockFixtureStateChangeMsg]}
        />
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

  it('posts "setFixtureState" request to other renderer', async () => {
    const handleRendererRequest = jest.fn();
    renderPlayground(
      <>
        <OnEvent eventName="renderer.request" handler={handleRendererRequest} />
        <SetPluginState
          pluginName="urlParams"
          state={{ fixturePath: 'fixtures/zwei.js' }}
        />
        <EmitEvent
          eventName="renderer.response"
          args={[getFixtureListResponse('foo-renderer')]}
        />
        <EmitEvent
          eventName="renderer.response"
          args={[getFixtureListResponse('bar-renderer')]}
        />
        <EmitEvent
          eventName="renderer.response"
          args={[mockFixtureStateChangeMsg]}
        />
      </>
    );

    await wait(() =>
      expect(handleRendererRequest).toBeCalledWith({
        type: 'setFixtureState',
        payload: {
          rendererId: 'bar-renderer',
          fixturePath: 'fixtures/zwei.js',
          fixtureStateChange: {
            components: []
          }
        }
      })
    );
  });
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

function getFixtureListResponse(rendererId) {
  return {
    type: 'fixtureList',
    payload: {
      rendererId,
      fixtures: ['fixtures/ein.js', 'fixtures/zwei.js', 'fixtures/drei.js']
    }
  };
}
