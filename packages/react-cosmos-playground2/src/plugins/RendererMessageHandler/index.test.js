// @flow

import React from 'react';
import { wait, render, cleanup } from 'react-testing-library';
import { Slot } from 'react-plugin';
import { PlaygroundProvider } from '../../PlaygroundProvider';
import { EmitEvent } from '../../testHelpers/EmitEvent';
import { OnEvent } from '../../testHelpers/OnEvent';
import { SetPluginState } from '../../testHelpers/SetPluginState';
import { OnPluginState } from '../../testHelpers/OnPluginState';
import { CallMethod } from '../../testHelpers/CallMethod';

// Plugins have side-effects: they register themselves
import '.';

afterEach(cleanup);

describe('on "fixtureList" renderer response', () => {
  it('creates renderer state', async () => {
    const handleSetRendererStates = jest.fn();
    renderPlayground(
      <>
        <OnPluginState
          pluginName="renderers"
          handler={handleSetRendererStates}
        />
        <EmitEvent
          eventName="renderer.response"
          args={[getFixtureListResponse('foo-renderer')]}
        />
      </>
    );

    await wait(() =>
      expect(handleSetRendererStates).toBeCalledWith(
        expect.objectContaining({
          'foo-renderer': {
            fixtures: [
              'fixtures/ein.js',
              'fixtures/zwei.js',
              'fixtures/drei.js'
            ],
            fixtureState: null
          }
        })
      )
    );
  });

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
          fixturePath: 'fixtures/zwei.js'
        }
      })
    );
  });
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
    const handleSetRendererStates = jest.fn();
    renderPlayground(
      <>
        <OnPluginState
          pluginName="renderers"
          handler={handleSetRendererStates}
        />
        <SetPluginState
          stateKey="urlParams"
          value={{ fixturePath: 'fixtures/zwei.js' }}
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
      expect(handleSetRendererStates).toBeCalledWith(
        expect.objectContaining({
          'foo-renderer': expect.objectContaining({
            fixtureState: {
              components: []
            }
          })
        })
      )
    );
  });

  // TODO: Revisit this
  it.skip('posts "setFixtureState" request to other renderer', async () => {
    const handleSetRendererStates = jest.fn();
    const handleRendererRequest = jest.fn();
    renderPlayground(
      <>
        <OnPluginState
          pluginName="renderers"
          handler={handleSetRendererStates}
        />
        <OnEvent eventName="renderer.request" handler={handleRendererRequest} />
        <SetPluginState
          stateKey="urlParams"
          value={{ fixturePath: 'fixtures/zwei.js' }}
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
      expect(handleSetRendererStates).toBeCalledWith(
        expect.objectContaining({
          'bar-renderer': expect.objectContaining({
            fixtureState: {
              components: []
            }
          })
        })
      )
    );

    await wait(() =>
      expect(handleRendererRequest).toBeCalledWith({
        type: 'setFixtureState',
        payload: {
          rendererId: 'bar-renderer',
          fixturePath: 'fixtures/zwei.js',
          fixtureState: {
            components: []
          }
        }
      })
    );
  });
});

describe('on "renderer.selectFixture" method', () => {
  const fixtures = getFixtures();
  const nonEmptyFixtureState = { components: [] };
  const rendererStates = {
    'foo-renderer': {
      fixtures,
      fixtureState: nonEmptyFixtureState
    },
    'bar-renderer': {
      fixtures,
      fixtureState: nonEmptyFixtureState
    }
  };

  it('resets fixture state for all renderers', async () => {
    const handleSetRendererStates = jest.fn();
    renderPlayground(
      <>
        <OnPluginState
          pluginName="renderers"
          handler={handleSetRendererStates}
        />
        <SetPluginState stateKey="renderers" value={rendererStates} />
        <CallMethod
          methodName="renderer.selectFixture"
          args={['fixtures/zwei.js']}
        />
      </>
    );

    await wait(() =>
      expect(handleSetRendererStates).toBeCalledWith({
        'foo-renderer': expect.objectContaining({
          fixtureState: null
        }),
        'bar-renderer': expect.objectContaining({
          fixtureState: null
        })
      })
    );
  });

  it('posts "selectFixture" renderer requests', async () => {
    const handleRendererRequest = jest.fn();
    renderPlayground(
      <>
        <OnEvent eventName="renderer.request" handler={handleRendererRequest} />
        <SetPluginState stateKey="renderers" value={rendererStates} />
        <CallMethod
          methodName="renderer.selectFixture"
          args={['fixtures/zwei.js']}
        />
      </>
    );

    await wait(() =>
      expect(handleRendererRequest).toBeCalledWith({
        type: 'selectFixture',
        payload: {
          rendererId: 'foo-renderer',
          fixturePath: 'fixtures/zwei.js'
        }
      })
    );
    await wait(() =>
      expect(handleRendererRequest).toBeCalledWith({
        type: 'selectFixture',
        payload: {
          rendererId: 'bar-renderer',
          fixturePath: 'fixtures/zwei.js'
        }
      })
    );
  });
});

describe('on "renderer.setFixtureState" method', () => {
  const fixtures = getFixtures();
  const rendererStates = {
    'foo-renderer': {
      fixtures,
      fixtureState: null
    },
    'bar-renderer': {
      fixtures,
      fixtureState: null
    }
  };
  const fixtureState = { components: [] };

  it('sets fixture state for all renderers', async () => {
    const handleSetRendererStates = jest.fn();
    renderPlayground(
      <>
        <OnPluginState
          pluginName="renderers"
          handler={handleSetRendererStates}
        />
        <SetPluginState
          stateKey="urlParams"
          value={{ fixturePath: 'fixtures/zwei.js' }}
        />
        <SetPluginState stateKey="renderers" value={rendererStates} />
        <CallMethod
          methodName="renderer.setFixtureState"
          args={[fixtureState]}
        />
      </>
    );

    await wait(() =>
      expect(handleSetRendererStates).toBeCalledWith({
        'foo-renderer': expect.objectContaining({
          fixtureState
        }),
        'bar-renderer': expect.objectContaining({
          fixtureState
        })
      })
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
        <SetPluginState stateKey="renderers" value={rendererStates} />
        <CallMethod
          methodName="renderer.setFixtureState"
          args={[fixtureState]}
        />
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
      fixtures: getFixtures()
    }
  };
}

function getFixtures() {
  return ['fixtures/ein.js', 'fixtures/zwei.js', 'fixtures/drei.js'];
}
