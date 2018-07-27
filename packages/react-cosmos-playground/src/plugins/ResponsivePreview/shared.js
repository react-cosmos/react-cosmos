// @flow

import localForage from 'localforage';

import type { UiContextParams } from '../../context';
import type {
  Device,
  Devices,
  PluginConfig,
  Viewport,
  PluginState
} from './types';

const DEFAULT_CONFIG = {
  devices: [
    { label: 'iPhone 5', width: 320, height: 568 },
    { label: 'iPhone 6', width: 375, height: 667 },
    { label: 'iPhone 6 Plus', width: 414, height: 736 },
    { label: 'Medium', width: 1024, height: 768 },
    { label: 'Large', width: 1440, height: 900 },
    { label: '1080p', width: 1920, height: 1080 }
  ]
};

const VIEWPORT_LOCALSTORAGE_KEY = '__cosmos__responsive-viewport';

const DEFAULT_VIEWPORT = {
  width: 320,
  height: 568
};

export function getPluginConfig(uiContext: UiContextParams): PluginConfig {
  if (uiContext.options.platform !== 'web') {
    return DEFAULT_CONFIG;
  }

  const { responsivePreview: config } = uiContext.options.plugin;

  if (!config || typeof config !== 'object') {
    return DEFAULT_CONFIG;
  }

  return {
    devices: getDevicesFromUntypedObject(config.devices)
  };
}

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

function getDevicesFromUntypedObject(obj: mixed): Devices {
  if (!Array.isArray(obj)) {
    return [];
  }

  return obj.reduce((devices, d) => {
    const device = getDeviceFromUntypedObject(d);
    return device ? [...devices, device] : devices;
  }, []);
}

function getDeviceFromUntypedObject(obj: mixed): ?Device {
  if (
    !obj ||
    typeof obj !== 'object' ||
    typeof obj.label !== 'string' ||
    typeof obj.width !== 'number' ||
    typeof obj.height !== 'number'
  ) {
    return undefined;
  }

  return { label: obj.label, width: obj.width, height: obj.height };
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
