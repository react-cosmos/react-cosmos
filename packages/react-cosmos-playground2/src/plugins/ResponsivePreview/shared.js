// @flow

export type Viewport = { width: number, height: number };

export type Device = Viewport & {
  label: string
};

export type ResponsivePreviewConfig = {
  devices: Device[]
};

type Enabled = {
  enabled: true,
  viewport: Viewport
};

type DisabledViewport = {
  enabled: false,
  viewport: Viewport
};

type DisabledNoViewport = {
  enabled: false,
  viewport: null
};

export type ResponsivePreviewState =
  | Enabled
  | DisabledViewport
  | DisabledNoViewport;

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
