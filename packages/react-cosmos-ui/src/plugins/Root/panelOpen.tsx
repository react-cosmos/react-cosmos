import { StorageSpec } from '../Storage/spec.js';
import { RootContext } from './shared.js';

export const PANEL_OPEN_STORAGE_KEY = 'sidePanelOpen';
const PANEL_OPEN_DEFAULT = true;

export function isPanelOpen(context: RootContext) {
  const storage = context.getMethodsOf<StorageSpec>('storage');
  const open = storage.getItem<boolean>(PANEL_OPEN_STORAGE_KEY);
  return typeof open === 'boolean' ? open : PANEL_OPEN_DEFAULT;
}

export function openPanel(context: RootContext, open: boolean) {
  const storage = context.getMethodsOf<StorageSpec>('storage');
  storage.setItem(PANEL_OPEN_STORAGE_KEY, open);
}
