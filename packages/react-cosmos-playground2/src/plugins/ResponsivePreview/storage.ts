import { DEFAULT_VIEWPORT, getResponsiveViewportStorageKey } from './shared';
import { StorageMethods } from './shared';
import { Viewport } from './public';

export async function getDefaultViewport(
  projectId: string,
  storage: StorageMethods
): Promise<Viewport> {
  const storageKey = getResponsiveViewportStorageKey(projectId);
  const storedViewport = await storage.getItem(storageKey);

  return storedViewport || DEFAULT_VIEWPORT;
}

export function storeViewport(
  projectId: string,
  viewport: Viewport,
  storage: StorageMethods
) {
  const storageKey = getResponsiveViewportStorageKey(projectId);
  storage.setItem(storageKey, viewport);
}
