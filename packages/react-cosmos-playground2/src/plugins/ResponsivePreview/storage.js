// @flow

import { DEFAULT_VIEWPORT, getResponsiveViewportStorageKey } from './shared';

import type { Storage } from '../Storage';
import type { Viewport } from './shared';

export async function getDefaultViewport(projectId: string, storage: Storage) {
  const storageKey = getResponsiveViewportStorageKey(projectId);
  const storedViewport = await storage.getItem(storageKey);

  return storedViewport || DEFAULT_VIEWPORT;
}

export function storeViewport(
  projectId: string,
  viewport: Viewport,
  storage: Storage
) {
  const storageKey = getResponsiveViewportStorageKey(projectId);
  storage.setItem(storageKey, viewport);
}
