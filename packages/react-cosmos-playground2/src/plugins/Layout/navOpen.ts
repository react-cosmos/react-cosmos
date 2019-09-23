import { StorageSpec } from '../Storage/public';
import { LayoutContext } from './shared';

export const NAV_OPEN_STORAGE_KEY = 'navOpen';
const NAV_OPEN_DEFAULT = true;

export function isNavOpen(context: LayoutContext) {
  const storage = context.getMethodsOf<StorageSpec>('storage');
  const open = storage.getItem<boolean>(NAV_OPEN_STORAGE_KEY);
  return typeof open === 'boolean' ? open : NAV_OPEN_DEFAULT;
}

export function openNav(context: LayoutContext, open: boolean) {
  const storage = context.getMethodsOf<StorageSpec>('storage');
  storage.setItem(NAV_OPEN_STORAGE_KEY, open);
}
