import React from 'react';
import { PluginContext } from 'react-plugin';
import { StorageSpec } from '../Storage/public';
import { ControlPanelSpec } from './public';

export type Context = PluginContext<ControlPanelSpec>;

const CONTROL_PANEL_OPEN = 'controlPanelOpen';
const CONTROL_PANEL_OPEN_DEFAULT = true;

export function isOpen(context: Context) {
  const storage = context.getMethodsOf<StorageSpec>('storage');
  const open = storage.getItem<boolean>(CONTROL_PANEL_OPEN);

  return typeof open === 'boolean' ? open : CONTROL_PANEL_OPEN_DEFAULT;
}

export function useOpenToggle(context: Context) {
  const storage = context.getMethodsOf<StorageSpec>('storage');
  const open = isOpen(context);

  return React.useCallback(() => {
    storage.setItem(CONTROL_PANEL_OPEN, !open);
  }, [storage, open]);
}
