import { StorageSpec } from '../../Storage/spec.js';
import { RootContext } from '../shared.js';

const STORAGE_KEY = 'controlPanelWidth';
const DEFAULT_VALUE = 320;
// Width used in demo screenshot
// const DEFAULT_VALUE = 284;

const MIN_SIZE = 150;
const MAX_SIZE = 600;

export function getControlPanelWidth(context: RootContext) {
  const storage = context.getMethodsOf<StorageSpec>('storage');
  const width = storage.getItem(STORAGE_KEY);
  return typeof width === 'number' ? restrictSize(width) : DEFAULT_VALUE;
}

export function setControlPanelWidth(context: RootContext, width: number) {
  const storage = context.getMethodsOf<StorageSpec>('storage');
  storage.setItem(STORAGE_KEY, restrictSize(width));
}

function restrictSize(size: number) {
  // We use the same restrictions for both width and height
  return Math.min(MAX_SIZE, Math.max(MIN_SIZE, size));
}
