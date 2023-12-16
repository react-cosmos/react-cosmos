import React, { SetStateAction } from 'react';
import { Viewport, ViewportFixtureState } from 'react-cosmos-core';
import { createPlugin } from 'react-plugin';
import { RendererCoreSpec } from '../RendererCore/spec.js';
import { StorageSpec } from '../Storage/spec.js';
import { ResponsivePreview } from './ResponsivePreview/ResponsivePreview.js';
import { ToggleButton } from './ToggleButton/index.js';
import {
  DEFAULT_DEVICES,
  DEFAULT_VIEWPORT_STATE,
  ResponsivePreviewContext,
  VIEWPORT_STORAGE_KEY,
  ViewportState,
} from './shared.js';
import { ResponsivePreviewSpec } from './spec.js';

const { plug, namedPlug, register } = createPlugin<ResponsivePreviewSpec>({
  name: 'responsivePreview',
  defaultConfig: {
    devices: DEFAULT_DEVICES,
  },
});

plug('rendererPreviewOuter', ({ children, pluginContext }) => {
  const { getConfig } = pluginContext;
  const { devices } = getConfig();
  const { enabled, viewport, scaled } = getViewportState(pluginContext);
  const onViewportChange = useViewportChange(pluginContext);
  const onScaledChange = useScaledChange(pluginContext);

  return (
    <ResponsivePreview
      devices={devices}
      enabled={enabled}
      viewport={viewport}
      scaled={scaled}
      setViewport={onViewportChange}
      setScaled={onScaledChange}
    >
      {children}
    </ResponsivePreview>
  );
});

namedPlug('rendererAction', 'responsivePreview', ({ pluginContext }) => {
  const { getMethodsOf } = pluginContext;
  const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');
  const viewportState = getViewportState(pluginContext);
  const { enabled, viewport } = viewportState;

  if (!rendererCore.getRendererUrl()) return null;

  return (
    <ToggleButton
      selected={enabled}
      onToggle={() => {
        if (enabled) {
          setViewportState(pluginContext, { ...viewportState, enabled: false });
          setViewportFixtureState(pluginContext, null);
        } else {
          setViewportState(pluginContext, { ...viewportState, enabled: true });
          setViewportFixtureState(pluginContext, viewport);
        }
      }}
    />
  );
});

export { register };

if (process.env.NODE_ENV !== 'test') register();

function useViewportChange(context: ResponsivePreviewContext) {
  const viewportState = getViewportState(context);
  return React.useCallback(
    (change: SetStateAction<Viewport>) => {
      const viewport =
        typeof change === 'function' ? change(viewportState.viewport) : change;
      setViewportState(context, { ...viewportState, enabled: true, viewport });
      setViewportFixtureState(context, viewport);
    },
    [context, viewportState]
  );
}

function useScaledChange(context: ResponsivePreviewContext) {
  const viewportState = getViewportState(context);
  return React.useCallback(
    (scaled: boolean) =>
      setViewportState(context, { ...viewportState, scaled }),
    [context, viewportState]
  );
}

function getViewportState(context: ResponsivePreviewContext): ViewportState {
  const { getMethodsOf } = context;
  const storage = getMethodsOf<StorageSpec>('storage');
  const viewportState =
    storage.getItem<ViewportState>(VIEWPORT_STORAGE_KEY) ||
    DEFAULT_VIEWPORT_STATE;

  const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');
  const viewport =
    rendererCore.getFixtureStateByName<ViewportFixtureState>('viewport');

  return viewport
    ? { ...viewportState, enabled: true, viewport }
    : viewportState;
}

function setViewportState(
  context: ResponsivePreviewContext,
  viewportState: ViewportState
) {
  const { getMethodsOf } = context;
  const storage = getMethodsOf<StorageSpec>('storage');
  storage.setItem(VIEWPORT_STORAGE_KEY, viewportState);
}

function setViewportFixtureState(
  context: ResponsivePreviewContext,
  viewport: ViewportFixtureState
) {
  const { getMethodsOf } = context;
  const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');
  rendererCore.setFixtureState<ViewportFixtureState>('viewport', viewport);
}
