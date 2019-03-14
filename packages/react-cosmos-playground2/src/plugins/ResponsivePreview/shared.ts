import { PluginContext } from 'react-plugin';
import { FixtureState } from 'react-cosmos-shared2/fixtureState';
import { StorageSpec } from '../Storage/public';
import { Viewport, ResponsivePreviewSpec } from './public';

export type Context = PluginContext<ResponsivePreviewSpec>;

export type StorageMethods = StorageSpec['methods'];

export const DEFAULT_DEVICES = [
  { label: 'iPhone 5', width: 320, height: 568 },
  { label: 'iPhone 6', width: 375, height: 667 },
  { label: 'iPhone 6 Plus', width: 414, height: 736 },
  { label: 'Medium', width: 1024, height: 768 },
  { label: 'Large', width: 1440, height: 900 },
  { label: '1080p', width: 1920, height: 1080 }
];

export const DEFAULT_VIEWPORT = {
  width: 320,
  height: 568
};

export function getResponsiveViewportStorageKey(projectId: string) {
  return `cosmos-responsiveViewport-${projectId}`;
}
