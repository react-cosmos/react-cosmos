import React from 'react';
import { createPlugin } from 'react-plugin';
import { RendererCoreSpec } from '../RendererCore/public';
import { StorageSpec } from '../Storage/public';
import { ResponsivePreviewSpec, Viewport } from './public';
import { ResponsivePreview } from './ResponsivePreview';
import {
  DEFAULT_DEVICES,
  DEFAULT_VIEWPORT_STATE,
  FixtureStateWithViewport,
  ResponsivePreviewContext,
  ViewportState,
  VIEWPORT_STORAGE_KEY
} from './shared';
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
  const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');
  const fixtureState = rendererCore.getFixtureState() as FixtureStateWithViewport;
  const viewportState = getViewportState(pluginContext);

  return (
    <ResponsivePreview
      devices={devices}
      enabled={fixtureState.viewport ? true : viewportState.enabled}
      viewport={fixtureState.viewport || viewportState.viewport}
      scaled={viewportState.scaled}
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

namedPlug('rendererAction', 'responsivePreview', ({ pluginContext }) => {
  const { getMethodsOf } = pluginContext;
  const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');
  const fixtureState = rendererCore.getFixtureState();
  const viewportState = getViewportState(pluginContext);
  const enabled = fixtureState.viewport ? true : viewportState.enabled;

  return (
    <ToggleButton
      selected={enabled}
      onToggle={() => {
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

function getViewportState(context: ResponsivePreviewContext): ViewportState {
  const storage = context.getMethodsOf<StorageSpec>('storage');
  return (
    storage.getItem<ViewportState>(VIEWPORT_STORAGE_KEY) ||
    DEFAULT_VIEWPORT_STATE
  );
}

function setViewportState(
  context: ResponsivePreviewContext,
  viewportState: ViewportState
) {
  const storage = context.getMethodsOf<StorageSpec>('storage');
  storage.setItem(VIEWPORT_STORAGE_KEY, viewportState);
}

function setFixtureStateViewport(
  context: ResponsivePreviewContext,
  viewport: null | Viewport
) {
  const rendererCore = context.getMethodsOf<RendererCoreSpec>('rendererCore');
  rendererCore.setFixtureState(fixtureState => ({ ...fixtureState, viewport }));
}
