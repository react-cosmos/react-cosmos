export type TreeExpansion = {
  [nodePath: string]: boolean;
};

export const NAV_WIDTH_STORAGE_KEY = 'navWidth';
export const NAV_WIDTH_DEFAULT = 256;
const NAV_WIDTH_MIN = 64;
const NAV_WIDTH_MAX = 512;

export const TREE_EXPANSION_STORAGE_KEY = 'navTreeExpansion';

export function restrictNavWidth(navWidth: number) {
  return Math.min(NAV_WIDTH_MAX, Math.max(NAV_WIDTH_MIN, navWidth));
}
