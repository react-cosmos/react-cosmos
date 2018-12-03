// @flow

import React from 'react';
import { wait, render, cleanup, fireEvent } from 'react-testing-library';
import { Slot } from 'react-plugin';
import { updateState } from 'react-cosmos-shared2/util';
import { PluginProvider } from '../../../plugin';
import { RegisterMethod } from '../../../testHelpers/RegisterMethod';
import { SetPluginState } from '../../../testHelpers/SetPluginState';
import { OnPluginState } from '../../../testHelpers/OnPluginState';
import { DEFAULT_DEVICES, getResponsiveViewportStorageKey } from '../shared';

// Plugins have side-effects: they register themselves
// "renderer" and "router" states are required for the ResponsivePreview plugin
// to work
import '../../Renderer';
import '../../Router';
import '..';

afterEach(cleanup);

const storageKey = getResponsiveViewportStorageKey('mockProjectId');

it('renders children of "rendererPreviewOuter" slot', () => {
  const { getByTestId } = renderPlayground();

  getByTestId('preview-mock');
});

it('does not render responsive header when no fixture is selected', () => {
  const { queryByTestId } = renderPlayground();

  expect(queryByTestId('responsive-header')).toBeNull();
});

it('does not render responsive header in full screen mode', () => {
  const { queryByTestId } = renderPlayground(
    <SetPluginState
      pluginName="router"
      value={{ urlParams: { fixturePath: 'fooFixture.js', fullScreen: true } }}
    />
  );

  expect(queryByTestId('responsive-header')).toBeNull();
});

it('renders responsive header', () => {
  const { getByTestId } = renderPlayground(
    <SetPluginState
      pluginName="router"
      value={{ urlParams: { fixturePath: 'fooFixture.js' } }}
    />
  );

  getByTestId('responsive-header');
});

it('renders responsive device labels', () => {
  const { getByText } = renderPlayground(
    <SetPluginState
      pluginName="router"
      value={{ urlParams: { fixturePath: 'fooFixture.js' } }}
    />
  );

  DEFAULT_DEVICES.forEach(({ label }) => {
    getByText(label);
  });
});

describe('on device select', () => {
  it('sets "responsive-preview" state', async () => {
    const handleSetResponsivePreviewState = jest.fn();
    const { getByText } = renderPlayground(
      <>
        <RegisterMethod methodName="storage.setItem" handler={() => {}} />
        <RegisterMethod
          methodName="renderer.setFixtureState"
          handler={() => {}}
        />
        <SetPluginState
          pluginName="router"
          value={{ urlParams: { fixturePath: 'fooFixture.js' } }}
        />
        <OnPluginState
          pluginName="responsive-preview"
          handler={handleSetResponsivePreviewState}
        />
      </>
    );

    fireEvent.click(getByText(/iphone 6 plus/i));

    await wait(() =>
      expect(handleSetResponsivePreviewState).lastCalledWith({
        enabled: true,
        viewport: { width: 414, height: 736 }
      })
    );
  });

  it('sets viewport in fixture state', async () => {
    let fixtureState = {};
    const handleSetFixtureState = stateChange => {
      fixtureState = updateState(fixtureState, stateChange);
    };

    const { getByText } = renderPlayground(
      <>
        <RegisterMethod methodName="storage.setItem" handler={() => {}} />
        <RegisterMethod
          methodName="renderer.setFixtureState"
          handler={handleSetFixtureState}
        />
        <SetPluginState
          pluginName="router"
          value={{ urlParams: { fixturePath: 'fooFixture.js' } }}
        />
      </>
    );

    fireEvent.click(getByText(/iphone 6 plus/i));

    await wait(() =>
      expect(fixtureState.viewport).toEqual({ width: 414, height: 736 })
    );
  });

  it('saves viewport in storage', async () => {
    let storage = {};

    const { getByText } = renderPlayground(
      <>
        <RegisterMethod
          methodName="storage.setItem"
          handler={(key, value) => Promise.resolve((storage[key] = value))}
        />
        <RegisterMethod
          methodName="renderer.setFixtureState"
          handler={() => {}}
        />
        <SetPluginState
          pluginName="router"
          value={{ urlParams: { fixturePath: 'fooFixture.js' } }}
        />
      </>
    );

    fireEvent.click(getByText(/iphone 6 plus/i));

    await wait(() =>
      expect(storage[storageKey]).toEqual({ width: 414, height: 736 })
    );
  });
});

function renderPlayground(otherNodes) {
  return render(
    <PluginProvider
      config={{
        core: { projectId: 'mockProjectId' },
        renderer: { webUrl: 'mockRendererUrl' },
        responsivePreview: { devices: DEFAULT_DEVICES }
      }}
    >
      {otherNodes}
      <Slot name="rendererPreviewOuter">
        <div data-testid="preview-mock" />
      </Slot>
      <SetPluginState
        pluginName="responsive-preview"
        value={{ enabled: true, viewport: { width: 320, height: 480 } }}
      />
    </PluginProvider>
  );
}
