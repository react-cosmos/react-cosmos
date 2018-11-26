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

const renderersState = {
  primaryRendererId: 'foo-renderer',
  renderers: {
    'foo-renderer': {
      fixtures: mockFixtures,
      fixtureState: mockFixtureState
    },
    'bar-renderer': {
      fixtures: mockFixtures,
      fixtureState: mockFixtureState
    }
  }
};

it('resets fixture state for all renderers', async () => {
  const handleSetRendererState = jest.fn();
  renderPlayground(
    <>
      <OnPluginState pluginName="renderer" handler={handleSetRendererState} />
      <SetPluginState pluginName="renderer" value={renderersState} />
      <CallMethod
        methodName="renderer.selectFixture"
        args={['fixtures/zwei.js']}
      />
    </>
  );

  await wait(() =>
    expect(handleSetRendererState).toBeCalledWith(
      expect.objectContaining({
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

it('posts "selectFixture" renderer requests', async () => {
  const handleRendererRequest = jest.fn();
  renderPlayground(
    <>
      <OnEvent eventName="renderer.request" handler={handleRendererRequest} />
      <SetPluginState pluginName="renderer" value={renderersState} />
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
        fixturePath: 'fixtures/zwei.js',
        fixtureState: null
      }
    })
  );

  await wait(() =>
    expect(handleRendererRequest).toBeCalledWith({
      type: 'selectFixture',
      payload: {
        rendererId: 'bar-renderer',
        fixturePath: 'fixtures/zwei.js',
        fixtureState: null
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
