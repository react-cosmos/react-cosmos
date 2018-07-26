// @flow

import localForage from 'localforage';

import type { UiContextParams } from '../../context';
import type { Viewport, PluginState } from './types';

const VIEWPORT_LOCALSTORAGE_KEY = '__cosmos__responsive-viewport';

const DEFAULT_VIEWPORT = {
  width: 320,
  height: 568
};

export function getPluginState(uiContext: UiContextParams): PluginState {
  const { responsive } = uiContext.state.plugin;

  const state = responsive && typeof responsive === 'object' ? responsive : {};
  const viewport = getViewportFromUntypedObject(state.viewport);

  // It's not possible for enabled to be true without a viewport
  if (state.enabled === true && viewport) {
    return {
      enabled: true,
      viewport
    };
  }

  if (viewport) {
    return {
      enabled: false,
      viewport
    };
  }

  return { enabled: false };
}

export function setPluginState(
  uiContext: UiContextParams,
  pluginState: PluginState
) {
  uiContext.setPluginState({ responsive: pluginState });
}

export function getFixtureViewport(uiContext: UiContextParams): ?Viewport {
  return getViewportFromUntypedObject(uiContext.state.fixtureBody.viewport);
}

export async function getLastViewportFromBrowserHistory(): Promise<Viewport> {
  try {
    const res = await localForage.getItem(VIEWPORT_LOCALSTORAGE_KEY);
    // Ensure stored value has width and height
    const { width, height } = JSON.parse(res);

    return { width, height };
  } catch (err) {
    return DEFAULT_VIEWPORT;
  }
}

export function storeViewportInBrowserHistory(viewport: Viewport) {
  localForage.setItem(VIEWPORT_LOCALSTORAGE_KEY, JSON.stringify(viewport));
}

function getViewportFromUntypedObject(obj: mixed): ?Viewport {
  if (
    !obj ||
    typeof obj !== 'object' ||
    typeof obj.width !== 'number' ||
    typeof obj.height !== 'number'
  ) {
    return undefined;
  }

  return { width: obj.width, height: obj.height };
}
