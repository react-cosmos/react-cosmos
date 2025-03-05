import { StorageSpec } from '../../Storage/spec.js';
import { RootContext } from '../shared.js';

const STORAGE_KEY = 'controlPanelWidth';
const DEFAULT_VALUE = 320;

const MIN_WIDTH = 224;
const MAX_WIDTH = 512;

export function getControlPanelWidth(context: RootContext) {
  const storage = context.getMethodsOf<StorageSpec>('storage');
  const width = storage.getItem<boolean>(STORAGE_KEY);
  return typeof width === 'number' ? restrictWidth(width) : DEFAULT_VALUE;
}

export function setControlPanelWidth(context: RootContext, width: number) {
  const storage = context.getMethodsOf<StorageSpec>('storage');
  storage.setItem(STORAGE_KEY, restrictWidth(width));
}

function restrictWidth(panelWidth: number) {
  return Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, panelWidth));
}
