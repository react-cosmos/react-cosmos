import { FixtureState } from 'react-cosmos-core';
import { PluginContext } from 'react-plugin';
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
  { label: 'iPhone SE', width: 375, height: 667 },
  { label: 'iPhone 12/13/14', width: 390, height: 844 },
  { label: 'iPhone 14 Pro', width: 393, height: 852 },
  { label: 'iPhone 14 Plus', width: 428, height: 926 },
  { label: 'iPhone 14 Pro Max', width: 430, height: 932 },

  { label: 'iPad mini', width: 744, height: 1133 },
  { label: 'iPad', width: 820, height: 1180 },
  { label: 'iPad Air', width: 820, height: 1180 },
  { label: 'iPad Pro 11"', width: 834, height: 1194 },
  { label: 'iPad Pro 12.9"', width: 1024, height: 1366 },

  { label: 'Small laptop', width: 1280, height: 720 },
  { label: 'Laptop', width: 1366, height: 768 },
  { label: 'Large laptop', width: 1536, height: 864 },

  { label: '1080p', width: 1920, height: 1080 },
  { label: '1440p', width: 2560, height: 1440 },
];

export const VIEWPORT_STORAGE_KEY = 'responsiveViewportState';

export const DEFAULT_VIEWPORT_STATE: ViewportState = {
  enabled: false,
  scaled: true,
  viewport: { width: 375, height: 667 },
};
