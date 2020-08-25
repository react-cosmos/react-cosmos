import React, { SetStateAction, useCallback, useState } from 'react';
import { FixtureState } from 'react-cosmos-shared2/fixtureState';
import { createPlugin } from 'react-plugin';
import { CoreSpec } from '../Core/public';
import { RendererCoreSpec } from '../RendererCore/public';
import { StorageSpec } from '../Storage/public';
import { ResponsivePreviewSpec, Viewport } from './public';
import { ResponsivePreview } from './ResponsivePreview/ResponsivePreview';
import {
  DEFAULT_DEVICES,
  DEFAULT_VIEWPORT_STATE,
  ResponsivePreviewContext,
  ViewportState,
  VIEWPORT_STORAGE_KEY,
} from './shared';
import { ToggleButton } from './ToggleButton';

const { plug, namedPlug, register } = createPlugin<ResponsivePreviewSpec>({
  name: 'responsivePreview',
  defaultConfig: {
    devices: DEFAULT_DEVICES,
  },
});

plug('rendererPreviewOuter', ({ children, pluginContext }) => {
  const { getConfig, getMethodsOf } = pluginContext;
  const { devices } = getConfig();
  const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');
  const fixtureState = rendererCore.getFixtureState();
  const { viewportState, setViewport, setScaled } = useViewportState(
    pluginContext,
    fixtureState
  );

  return (
    <ResponsivePreview
      devices={devices}
      enabled={viewportState.enabled}
      viewport={viewportState.viewport}
      scaled={viewportState.scaled}
      validFixtureSelected={rendererCore.isValidFixtureSelected()}
      setViewport={setViewport}
      setScaled={setScaled}
    >
      {children}
    </ResponsivePreview>
  );
});

namedPlug('rendererAction', 'responsivePreview', ({ pluginContext }) => {
  const { getMethodsOf } = pluginContext;
  const core = getMethodsOf<CoreSpec>('core');
  const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');
  const fixtureState = rendererCore.getFixtureState();
  const { viewportState, setViewportState } = useViewportState(
    pluginContext,
    fixtureState
  );

  if (!core.getWebRendererUrl()) return null;

  return (
    <ToggleButton
      selected={viewportState.enabled}
      onToggle={() => {
        if (viewportState.enabled) {
          setViewportState({ ...viewportState, enabled: false });
          setFixtureStateViewport(pluginContext, null);
        } else {
          setViewportState({ ...viewportState, enabled: true });
          setFixtureStateViewport(pluginContext, viewportState.viewport);
        }
      }}
    />
  );
});

register();

function useViewportState(
  context: ResponsivePreviewContext,
  fixtureState: FixtureState
) {
  const fixtureViewport = fixtureState.viewport as Viewport | undefined;

  // FIXME: Use plugin state instead of hook state, in order for state to be
  // shared between plugs
  const [viewportState, setViewportState] = useState<ViewportState>(() => {
    const persistedState = getPersistedState(context);
    if (!fixtureViewport) return persistedState;

    return {
      enabled: true,
      scaled: persistedState.scaled ?? true,
      viewport: fixtureViewport,
    };
  });

  // useEffect(() => {
  //   if (fixtureViewport)
  //     setViewportState(prevViewportState => ({
  //       ...prevViewportState,
  //       // enabled: true,
  //       viewport: fixtureViewport,
  //     }));
  // }, [fixtureViewport]);

  const setAndPersistViewportState = useCallback(
    (stateChange: SetStateAction<ViewportState>) => {
      const newViewportState =
        typeof stateChange === 'function'
          ? stateChange(viewportState)
          : stateChange;
      setViewportState(newViewportState);
      persistState(context, newViewportState);
      setFixtureStateViewport(context, newViewportState.viewport);
    },
    [context, viewportState]
  );

  const setViewport = useCallback(
    (viewportChange: SetStateAction<Viewport>) => {
      setAndPersistViewportState(prevState => ({
        ...prevState,
        enabled: true,
        viewport:
          typeof viewportChange === 'function'
            ? viewportChange(viewportState.viewport)
            : viewportChange,
      }));
    },
    [setAndPersistViewportState, viewportState.viewport]
  );

  const setScaled = useCallback(
    (scaled: boolean) => {
      setAndPersistViewportState(prevState => ({ ...prevState, scaled }));
    },
    [setAndPersistViewportState]
  );

  return {
    viewportState,
    setViewportState: setAndPersistViewportState,
    setViewport,
    setScaled,
  };
}

function getPersistedState(context: ResponsivePreviewContext): ViewportState {
  const { getMethodsOf } = context;
  const storage = getMethodsOf<StorageSpec>('storage');
  return (
    storage.getItem<ViewportState>(VIEWPORT_STORAGE_KEY) ||
    DEFAULT_VIEWPORT_STATE
  );
}

function persistState(
  context: ResponsivePreviewContext,
  viewportState: ViewportState
) {
  const { getMethodsOf } = context;
  const storage = getMethodsOf<StorageSpec>('storage');
  storage.setItem(VIEWPORT_STORAGE_KEY, viewportState);
}

function setFixtureStateViewport(
  context: ResponsivePreviewContext,
  viewport: null | Viewport
) {
  const { getMethodsOf } = context;
  const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');
  rendererCore.setFixtureState(fixtureState => ({
    ...fixtureState,
    viewport,
  }));
}
