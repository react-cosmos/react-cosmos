import React from 'react';
import { StorageSpec } from '../Storage/spec';
import { ContentOverlayContext } from './shared';

export const WELCOME_DISMISS_STORAGE_KEY = 'welcomeDismissedAt';
const SHOW_AGAIN_IN = 90 * 86400 * 1000; // ~3 months

export function useWelcomeDismiss(context: ContentOverlayContext) {
  const { getMethodsOf } = context;
  const storage = getMethodsOf<StorageSpec>('storage');
  const welcomeDismissedAt =
    storage.getItem<number>(WELCOME_DISMISS_STORAGE_KEY) || 0;

  // Show welcome screen again after a while
  const welcomeDismissed = welcomeDismissedAt > Date.now() - SHOW_AGAIN_IN;
  const onDismissWelcome = React.useCallback(
    () => storage.setItem(WELCOME_DISMISS_STORAGE_KEY, Date.now()),
    [storage]
  );
  const onShowWelcome = React.useCallback(
    () => storage.setItem(WELCOME_DISMISS_STORAGE_KEY, 0),
    [storage]
  );

  return {
    welcomeDismissed,
    onDismissWelcome,
    onShowWelcome,
  };
}
