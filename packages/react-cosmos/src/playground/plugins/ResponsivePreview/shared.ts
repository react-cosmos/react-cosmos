import { PluginContext } from 'react-plugin';
import { FixtureState } from '../../../core/fixtureState/types.js';
import { StorageSpec } from '../Storage/spec.js';
import { ResponsivePreviewSpec, ResponsiveViewport } from './spec.js';

export type ResponsivePreviewContext = PluginContext<ResponsivePreviewSpec>;

export type StorageMethods = StorageSpec['methods'];

export type FixtureStateWithViewport = FixtureState & {
  viewport?: ResponsiveViewport;
};

export type ViewportState = {
  enabled: boolean;
  scaled: boolean;
  viewport: ResponsiveViewport;
};

export const DEFAULT_DEVICES = [
  { label: 'iPhone 5/SE', width: 320, height: 568 },
  { label: 'iPhone 6/7/8', width: 375, height: 667 },
  { label: 'iPhone 6/7/8 Plus', width: 414, height: 736 },
  { label: 'iPhone X', width: 375, height: 812 },
  { label: 'iPad', width: 768, height: 1024 },
  { label: 'iPad Pro', width: 1024, height: 1366 },
  { label: 'Small laptop', width: 1280, height: 720 },
  { label: 'Laptop', width: 1366, height: 768 },
  { label: 'Large laptop', width: 1600, height: 900 },
  { label: 'Full HD', width: 1920, height: 1080 },
  { label: 'Quad HD', width: 2560, height: 1440 },
];

export const VIEWPORT_STORAGE_KEY = 'responsiveViewportState';

export const DEFAULT_VIEWPORT_STATE: ViewportState = {
  enabled: false,
  scaled: true,
  viewport: { width: 320, height: 568 },
};
