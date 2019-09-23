import React from 'react';
import { createPlugin } from 'react-plugin';
import { StorageSpec } from '../Storage/public';
import { RendererCoreSpec } from '../RendererCore/public';
import { RouterSpec } from '../Router/public';
import { ResponsivePreviewSpec, Viewport } from './public';
import {
  Context,
  DEFAULT_DEVICES,
  VIEWPORT_STORAGE_KEY,
  DEFAULT_VIEWPORT_STATE,
  ViewportState,
  FixtureStateWithViewport
} from './shared';
import { ResponsivePreview } from './ResponsivePreview';
import { ToggleButton } from './ToggleButton';

const { plug, namedPlug, register } = createPlugin<ResponsivePreviewSpec>({
  name: 'responsivePreview',
  defaultConfig: {
    devices: DEFAULT_DEVICES
  }
});

plug('rendererPreviewOuter', ({ children, pluginContext }) => {
  const { getConfig, getMethodsOf } = pluginContext;
  const { devices } = getConfig();
  const router = getMethodsOf<RouterSpec>('router');
  const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');
  const fixtureState = rendererCore.getFixtureState() as FixtureStateWithViewport;
  const viewportState = getViewportState(pluginContext);

  return (
    <ResponsivePreview
      devices={devices}
      enabled={fixtureState.viewport ? true : viewportState.enabled}
      viewport={fixtureState.viewport || viewportState.viewport}
      scaled={viewportState.scaled}
      fullScreen={router.isFullScreen()}
      validFixtureSelected={rendererCore.isValidFixtureSelected()}
      setViewport={newViewport => {
        setViewportState(pluginContext, {
          ...viewportState,
          enabled: true,
          viewport: newViewport
        });
        setFixtureStateViewport(pluginContext, newViewport);
      }}
      setScaled={scaled =>
        setViewportState(pluginContext, { ...viewportState, scaled })
      }
    >
      {children}
    </ResponsivePreview>
  );
});

namedPlug('topBarRightAction', 'responsivePreview', ({ pluginContext }) => {
  const { getMethodsOf } = pluginContext;
  const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');
  const fixtureState = rendererCore.getFixtureState();
  const viewportState = getViewportState(pluginContext);
  const enabled = fixtureState.viewport ? true : viewportState.enabled;

  return (
    <ToggleButton
      validFixtureSelected={rendererCore.isValidFixtureSelected()}
      enabled={enabled}
      toggleViewportState={() => {
        if (enabled) {
          setViewportState(pluginContext, { ...viewportState, enabled: false });
          setFixtureStateViewport(pluginContext, null);
        } else {
          setViewportState(pluginContext, { ...viewportState, enabled: true });
          setFixtureStateViewport(pluginContext, viewportState.viewport);
        }
      }}
    />
  );
});

export { register };

function getViewportState(context: Context): ViewportState {
  const storage = context.getMethodsOf<StorageSpec>('storage');
  return (
    storage.getItem<ViewportState>(VIEWPORT_STORAGE_KEY) ||
    DEFAULT_VIEWPORT_STATE
  );
}

function setViewportState(context: Context, viewportState: ViewportState) {
  const storage = context.getMethodsOf<StorageSpec>('storage');
  storage.setItem(VIEWPORT_STORAGE_KEY, viewportState);
}

function setFixtureStateViewport(context: Context, viewport: null | Viewport) {
  const rendererCore = context.getMethodsOf<RendererCoreSpec>('rendererCore');
  rendererCore.setFixtureState(fixtureState => ({ ...fixtureState, viewport }));
}
