// @flow

import localForage from 'localforage';

import type { Viewport } from './types';

const VIEWPORT_LOCALSTORAGE_KEY = '__cosmos__responsive-viewport';

const DEFAULT_VIEWPORT = {
  width: 320,
  height: 568
};

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
