import { StorageSpec } from '../Storage/spec.js';
import { RootContext } from './shared.js';

export const NAV_OPEN_STORAGE_KEY = 'floatingPanes';

const DEFAULT_VALUE = false;

export function getFloatingPanes(context: RootContext) {
  const storage = context.getMethodsOf<StorageSpec>('storage');
  const open = storage.getItem<boolean>(NAV_OPEN_STORAGE_KEY);
  return typeof open === 'boolean' ? open : DEFAULT_VALUE;
}

export function setFloatingPanes(context: RootContext, open: boolean) {
  const storage = context.getMethodsOf<StorageSpec>('storage');
  storage.setItem(NAV_OPEN_STORAGE_KEY, open);
}
