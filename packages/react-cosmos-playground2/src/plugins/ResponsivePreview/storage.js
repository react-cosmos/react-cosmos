// @flow

import {
  DEFAULT_VIEWPORT,
  getResponsiveViewportStorageKey,
  getResponsivePreviewState
} from './shared';

import type { PluginContextValue } from '../../plugin';

export async function getDefaultViewport({
  getConfig,
  callMethod
}: PluginContextValue) {
  const projectId = getConfig('core.projectId');
  const storageKey = getResponsiveViewportStorageKey(projectId);
  const storedViewport = await callMethod('storage.getItem', storageKey);

  return storedViewport || DEFAULT_VIEWPORT;
}

export function storeViewport(context: PluginContextValue) {
  const { getConfig, callMethod } = context;
  const projectId = getConfig('core.projectId');
  const storageKey = getResponsiveViewportStorageKey(projectId);
  const { viewport } = getResponsivePreviewState(context);

  callMethod('storage.setItem', storageKey, viewport);
}
