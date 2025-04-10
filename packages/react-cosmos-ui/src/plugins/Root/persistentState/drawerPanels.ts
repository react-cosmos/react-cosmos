import { StorageSpec } from '../../Storage/spec.js';
import { RootContext } from '../shared.js';

const STORAGE_KEY = 'drawerPanels';
const DEFAULT_VALUE = window.innerWidth < 640;

export function drawerPanelsEnabled(context: RootContext) {
  const storage = context.getMethodsOf<StorageSpec>('storage');
  const open = storage.getItem(STORAGE_KEY);
  return typeof open === 'boolean' ? open : DEFAULT_VALUE;
}

export function setDrawerPanels(context: RootContext, enabled: boolean) {
  const storage = context.getMethodsOf<StorageSpec>('storage');
  storage.setItem(STORAGE_KEY, enabled);
}
