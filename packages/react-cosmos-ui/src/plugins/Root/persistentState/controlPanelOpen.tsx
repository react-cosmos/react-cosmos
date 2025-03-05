import { StorageSpec } from '../../Storage/spec.js';
import { RootContext } from '../shared.js';

const STORAGE_KEY = 'controlPanelOpen';
const DEFAULT_VALUE = window.innerWidth >= 960;

export function isControlPanelOpen(context: RootContext) {
  const storage = context.getMethodsOf<StorageSpec>('storage');
  const open = storage.getItem(STORAGE_KEY);
  return typeof open === 'boolean' ? open : DEFAULT_VALUE;
}

export function openControlPanel(context: RootContext, open: boolean) {
  const storage = context.getMethodsOf<StorageSpec>('storage');
  storage.setItem(STORAGE_KEY, open);
}
