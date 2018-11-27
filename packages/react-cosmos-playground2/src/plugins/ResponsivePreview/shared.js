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

export const DEFAULT_VIEWPORT = {
  width: 320,
  height: 568
};
