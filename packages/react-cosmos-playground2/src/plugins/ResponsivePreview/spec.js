// @flow

export type Viewport = { width: number, height: number };

export type Device = Viewport & {
  label: string
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

export type ResponsivePreviewSpec = {
  name: 'responsivePreview',
  config: {
    devices: Device[]
  },
  state: Enabled | DisabledViewport | DisabledNoViewport
};
