import { StorageSpec } from '../../Storage/spec.js';
import { RootContext } from '../shared.js';

const STORAGE_KEY = 'navPanelWidth';
const DEFAULT_VALUE = 320;

const MIN_WIDTH = 224;
const MAX_WIDTH = 512;

export function getNavPanelWidth(context: RootContext) {
  const storage = context.getMethodsOf<StorageSpec>('storage');
  const width = storage.getItem(STORAGE_KEY);
  return typeof width === 'number' ? restrictWidth(width) : DEFAULT_VALUE;
}

export function setNavPanelWidth(context: RootContext, width: number) {
  const storage = context.getMethodsOf<StorageSpec>('storage');
  storage.setItem(STORAGE_KEY, restrictWidth(width));
}

function restrictWidth(navWidth: number) {
  return Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, navWidth));
}
