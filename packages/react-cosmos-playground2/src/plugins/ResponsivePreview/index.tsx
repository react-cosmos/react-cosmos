import React from 'react';
import { createPlugin } from 'react-plugin';
import { FixtureState } from 'react-cosmos-shared2/fixtureState';
import { StorageSpec } from '../Storage/public';
import { RendererCoreSpec } from '../RendererCore/public';
import { RouterSpec } from '../Router/public';
import { ResponsivePreviewSpec, Viewport } from './public';
import {
  Context,
  DEFAULT_DEVICES,
  DEFAULT_VIEWPORT,
  STORAGE_KEY
} from './shared';
import { ResponsivePreview } from './ResponsivePreview';
import { ToggleButton } from './ToggleButton';

const { plug, namedPlug, register } = createPlugin<ResponsivePreviewSpec>({
  name: 'responsivePreview',
  defaultConfig: {
    devices: DEFAULT_DEVICES
  },
  initialState: {
    enabled: false,
    viewport: null
  }
});

plug('rendererPreviewOuter', ({ children, pluginContext }) => {
  const { getConfig, getState, setState, getMethodsOf } = pluginContext;
  const { devices } = getConfig();
  const { enabled } = getState();
  const storage = getMethodsOf<StorageSpec>('storage');
  const router = getMethodsOf<RouterSpec>('router');
  const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');
  const fixtureState = rendererCore.getFixtureState();
  const viewport =
    fixtureState.viewport || getActiveViewport(pluginContext, enabled);

  return (
    <ResponsivePreview
      devices={devices}
      viewport={viewport}
      fullScreen={router.isFullScreen()}
      validFixtureSelected={rendererCore.isValidFixtureSelected()}
      setViewport={(newViewport: Viewport) => {
        storage.setItem(STORAGE_KEY, newViewport);
        setFixtureStateViewport(pluginContext, newViewport);
        setState({ enabled: true, viewport: newViewport });
      }}
    >
      {children}
    </ResponsivePreview>
  );
});

namedPlug('rendererAction', 'responsivePreview', ({ pluginContext }) => {
  const { getState, setState, getMethodsOf } = pluginContext;
  const { enabled } = getState();
  const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');
  const fixtureState = rendererCore.getFixtureState();
  const responsiveModeOn = isResponsiveModeOn(enabled, fixtureState);

  return (
    <ToggleButton
      validFixtureSelected={rendererCore.isValidFixtureSelected()}
      responsiveModeOn={responsiveModeOn}
      toggleViewportState={() => {
        const nextEnabled = !responsiveModeOn;
        setState(prevState => ({ ...prevState, enabled: nextEnabled }));
        setFixtureStateViewport(
          pluginContext,
          getActiveViewport(pluginContext, nextEnabled)
        );
      }}
    />
  );
});

export { register };

function getActiveViewport(context: Context, responsiveModeEnabled: boolean) {
  const storage = context.getMethodsOf<StorageSpec>('storage');
  return responsiveModeEnabled
    ? storage.getItem<Viewport>(STORAGE_KEY) || DEFAULT_VIEWPORT
    : null;
}

function setFixtureStateViewport(context: Context, viewport: null | Viewport) {
  const rendererCore = context.getMethodsOf<RendererCoreSpec>('rendererCore');
  rendererCore.setFixtureState(fixtureState => ({ ...fixtureState, viewport }));
}

function isResponsiveModeOn(
  responsiveModeEnabled: boolean,
  fixtureState: FixtureState
): boolean {
  return fixtureState.viewport ? true : responsiveModeEnabled;
}
