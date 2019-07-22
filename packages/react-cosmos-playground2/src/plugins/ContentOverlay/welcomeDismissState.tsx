import { StorageSpec } from '../Storage/public';
import { Context } from './shared';

export const DISMISS_STATE_STORAGE_KEY = 'welcomeDismissed';
const DISMISS_STATE_DEFAULT = false;

export function getWelcomeDismissState({ getMethodsOf }: Context) {
  const storage = getMethodsOf<StorageSpec>('storage');
  return {
    welcomeDismissed:
      storage.getItem<boolean>(DISMISS_STATE_STORAGE_KEY) ||
      DISMISS_STATE_DEFAULT,
    setWelcomeDismissed: (welcomeDismissed: boolean) =>
      storage.setItem(DISMISS_STATE_STORAGE_KEY, welcomeDismissed)
  };
}
