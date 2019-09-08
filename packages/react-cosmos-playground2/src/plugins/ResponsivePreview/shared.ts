import { FixtureState } from 'react-cosmos-shared2/fixtureState';
import { PluginContext } from 'react-plugin';
import { StorageSpec } from '../Storage/public';
import { ResponsivePreviewSpec, Viewport } from './public';

export type Context = PluginContext<ResponsivePreviewSpec>;

export type StorageMethods = StorageSpec['methods'];

export type FixtureStateWithViewport = FixtureState & {
  viewport?: Viewport;
};

export type ViewportState = {
  enabled: boolean;
  scaled: boolean;
  viewport: Viewport;
};

export const DEFAULT_DEVICES = [
  { label: 'iPhone 5', width: 320, height: 568 },
  { label: 'iPhone 6', width: 375, height: 667 },
  { label: 'iPhone 6+', width: 414, height: 736 },
  { label: 'Medium', width: 1024, height: 768 },
  { label: 'Large', width: 1440, height: 900 },
  { label: '1080p', width: 1920, height: 1080 }
];

export const VIEWPORT_STORAGE_KEY = 'responsiveViewportState';

export const DEFAULT_VIEWPORT_STATE: ViewportState = {
  enabled: false,
  scaled: true,
  viewport: { width: 320, height: 568 }
};
