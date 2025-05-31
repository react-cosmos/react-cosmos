import { StorageSpec } from '../../Storage/spec.js';
import { RootContext } from '../shared.js';

const STORAGE_KEY = 'navPanelOpen';
const DEFAULT_VALUE = window.innerWidth >= 640;

export function isNavPanelOpen(context: RootContext) {
  const storage = context.getMethodsOf<StorageSpec>('storage');
  const open = storage.getItem(STORAGE_KEY);
  return typeof open === 'boolean' ? open : DEFAULT_VALUE;
}

export function setNavPanelState(context: RootContext, open: boolean) {
  const storage = context.getMethodsOf<StorageSpec>('storage');
  storage.setItem(STORAGE_KEY, open);
}
