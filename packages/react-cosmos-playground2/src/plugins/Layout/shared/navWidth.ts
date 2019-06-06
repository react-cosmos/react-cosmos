import { StorageSpec } from '../../Storage/public';
import { Context } from './shared';

const NAV_WIDTH_STORAGE_KEY = 'navWidth';
const NAV_WIDTH_DEFAULT = 256;

const NAV_WIDTH_MIN = 64;
const NAV_WIDTH_MAX = 512;

export function getNavWidthApi({ getMethodsOf }: Context) {
  const storage = getMethodsOf<StorageSpec>('storage');
  return {
    navWidth:
      storage.getItem<number>(NAV_WIDTH_STORAGE_KEY) || NAV_WIDTH_DEFAULT,
    setNavWidth: (newWidth: number) =>
      storage.setItem(NAV_WIDTH_STORAGE_KEY, restrictNavWidth(newWidth))
  };
}

function restrictNavWidth(navWidth: number) {
  return Math.min(NAV_WIDTH_MAX, Math.max(NAV_WIDTH_MIN, navWidth));
}
