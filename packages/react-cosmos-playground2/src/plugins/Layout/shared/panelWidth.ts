import { StorageSpec } from '../../Storage/public';
import { Context } from './shared';

const PANEL_WIDTH_STORAGE_KEY = 'panelWidth';
const PANEL_WIDTH_DEFAULT = 320;

const PANEL_WIDTH_MIN = 224;
const PANEL_WIDTH_MAX = 512;

export function getPanelWidthApi({ getMethodsOf }: Context) {
  const storage = getMethodsOf<StorageSpec>('storage');
  return {
    panelWidth:
      storage.getItem<number>(PANEL_WIDTH_STORAGE_KEY) || PANEL_WIDTH_DEFAULT,
    setPanelWidth: (newWidth: number) =>
      storage.setItem(PANEL_WIDTH_STORAGE_KEY, restrictPanelWidth(newWidth))
  };
}

function restrictPanelWidth(panelWidth: number) {
  return Math.min(PANEL_WIDTH_MAX, Math.max(PANEL_WIDTH_MIN, panelWidth));
}
