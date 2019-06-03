import { RendererCoreSpec } from '../../RendererCore/public';
import { StorageSpec } from '../../Storage/public';
import { Context } from './shared';

const PANEL_OPEN_STORAGE_KEY = 'controlPanelOpen';
const PANEL_OPEN_DEFAULT = true;

export function isPanelOpen(context: Context) {
  const { getMethodsOf } = context;
  const rendererCore = getMethodsOf<RendererCoreSpec>('rendererCore');
  if (!rendererCore.isValidFixtureSelected()) {
    return false;
  }

  const storage = context.getMethodsOf<StorageSpec>('storage');
  const open = storage.getItem<boolean>(PANEL_OPEN_STORAGE_KEY);
  return typeof open === 'boolean' ? open : PANEL_OPEN_DEFAULT;
}

export function openPanel(context: Context, open: boolean) {
  const storage = context.getMethodsOf<StorageSpec>('storage');
  storage.setItem(PANEL_OPEN_STORAGE_KEY, open);
}
