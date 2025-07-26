import { StorageSpec } from '../../Storage/spec.js';
import { RootContext } from '../shared.js';

const STORAGE_KEY = 'toolbarPosition';

export type ToolbarPosition = 'top' | 'bottom';

function getDefaultPosition(): ToolbarPosition {
  return window.innerHeight > window.innerWidth && window.innerWidth < 768
    ? 'bottom'
    : 'top';
}

export function getToolbarPosition(context: RootContext): ToolbarPosition {
  const storage = context.getMethodsOf<StorageSpec>('storage');
  const position = storage.getItem(STORAGE_KEY);
  return position === 'top' || position === 'bottom' ? position : getDefaultPosition();
}

export function setToolbarPosition(context: RootContext, position: ToolbarPosition) {
  const storage = context.getMethodsOf<StorageSpec>('storage');
  storage.setItem(STORAGE_KEY, position);
}