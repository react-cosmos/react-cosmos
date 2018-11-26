// @flow

import React from 'react';
import { wait, render, cleanup } from 'react-testing-library';
import { Slot } from 'react-plugin';
import { PluginProvider } from '../../../plugin';
import { OnEvent } from '../../../testHelpers/OnEvent';
import { SetPluginState } from '../../../testHelpers/SetPluginState';
import { OnPluginState } from '../../../testHelpers/OnPluginState';
import { CallMethod } from '../../../testHelpers/CallMethod';
import { mockFixtures, mockFixtureState } from '../testHelpers';

// Plugins have side-effects: they register themselves
// "router" state is required for Renderer plugin to work
import '../../Router';
import '..';

afterEach(cleanup);

const rendererState = {
  primaryRendererId: 'foo-renderer',
  renderers: {
    'foo-renderer': {
      fixtures: mockFixtures,
      fixtureState: null
    },
    'bar-renderer': {
      fixtures: mockFixtures,
      fixtureState: null
    }
  }
};

it('sets fixture state for all renderers', async () => {
  const handleSetRendererState = jest.fn();
  renderPlayground(
    <>
      <OnPluginState pluginName="renderer" handler={handleSetRendererState} />
      <SetPluginState
        pluginName="router"
        value={{ urlParams: { fixturePath: 'fixtures/zwei.js' } }}
      />
      <SetPluginState pluginName="renderer" value={rendererState} />
      <CallMethod
        methodName="renderer.setFixtureState"
        args={[mockFixtureState]}
      />
    </>
  );

  await wait(() =>
    expect(handleSetRendererState).toBeCalledWith(
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

it('posts "setFixtureState" renderer requests', async () => {
  const handleRendererRequest = jest.fn();
  renderPlayground(
    <>
      <OnEvent eventName="renderer.request" handler={handleRendererRequest} />
      <SetPluginState
        pluginName="router"
        value={{ urlParams: { fixturePath: 'fixtures/zwei.js' } }}
      />
      <SetPluginState pluginName="renderer" value={rendererState} />
      <CallMethod
        methodName="renderer.setFixtureState"
        args={[mockFixtureState]}
      />
    </>
  );

  await wait(() =>
    expect(handleRendererRequest).toBeCalledWith({
      type: 'setFixtureState',
      payload: {
        rendererId: 'foo-renderer',
        fixturePath: 'fixtures/zwei.js',
        fixtureState: mockFixtureState
      }
    })
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
    <PluginProvider>
      <Slot name="global" />
      {otherNodes}
    </PluginProvider>
  );
}
