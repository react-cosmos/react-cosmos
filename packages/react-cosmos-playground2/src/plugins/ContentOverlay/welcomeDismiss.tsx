import React from 'react';
import { StorageSpec } from '../Storage/public';
import { ContentOverlayContext } from './shared';

export const DISMISS_STATE_STORAGE_KEY = 'welcomeDismissed';
const DISMISS_STATE_DEFAULT = false;

// TODO: Show welcome screen every 3 months (welcomeDismissedAt)
export function useWelcomeDismissState(context: ContentOverlayContext) {
  const { getMethodsOf } = context;
  const storage = getMethodsOf<StorageSpec>('storage');

  const welcomeDismissed =
    storage.getItem<boolean>(DISMISS_STATE_STORAGE_KEY) ||
    DISMISS_STATE_DEFAULT;
  const onDismissWelcome = React.useCallback(
    () => storage.setItem(DISMISS_STATE_STORAGE_KEY, true),
    [storage]
  );
  const onShowWelcome = React.useCallback(
    () => storage.setItem(DISMISS_STATE_STORAGE_KEY, false),
    [storage]
  );

  return {
    welcomeDismissed,
    onDismissWelcome,
    onShowWelcome
  };
}
