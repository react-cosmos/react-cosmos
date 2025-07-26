import { StorageSpec } from '../../Storage/spec.js';
import { RootContext } from '../shared.js';

const STORAGE_KEY = 'controlPanelPosition';
type ControlPanelPosition = 'right' | 'bottom';
const DEFAULT_VALUE: ControlPanelPosition = 'right';

export function getControlPanelPosition(context: RootContext): ControlPanelPosition {
  const storage = context.getMethodsOf<StorageSpec>('storage');
  const position = storage.getItem(STORAGE_KEY);
  return position === 'right' || position === 'bottom' ? position : DEFAULT_VALUE;
}

export function setControlPanelPosition(context: RootContext, position: ControlPanelPosition) {
  const storage = context.getMethodsOf<StorageSpec>('storage');
  storage.setItem(STORAGE_KEY, position);
}