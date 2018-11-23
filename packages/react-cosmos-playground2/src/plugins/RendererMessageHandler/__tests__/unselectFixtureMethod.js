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
// "urlParams" state is required for RendererMessageHandler plugin to work
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
  const handleSetRenderersState = jest.fn();
  renderPlayground(
    <>
      <OnPluginState stateKey="renderers" handler={handleSetRenderersState} />
      <SetPluginState stateKey="renderers" value={renderersState} />
      <CallMethod methodName="renderer.unselectFixture" />
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
            fixtureState: null
          })
        }
      })
    )
  );
});

it('posts "unselectFixture" renderer requests', async () => {
  const handleRendererRequest = jest.fn();
  renderPlayground(
    <>
      <OnEvent eventName="renderer.request" handler={handleRendererRequest} />
      <SetPluginState stateKey="renderers" value={renderersState} />
      <CallMethod
        methodName="renderer.unselectFixture"
        args={['fixtures/zwei.js']}
      />
    </>
  );

  await wait(() =>
    expect(handleRendererRequest).toBeCalledWith({
      type: 'unselectFixture',
      payload: {
        rendererId: 'foo-renderer'
      }
    })
  );

  await wait(() =>
    expect(handleRendererRequest).toBeCalledWith({
      type: 'unselectFixture',
      payload: {
        rendererId: 'bar-renderer'
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
