export type Viewport = { width: number; height: number };

export type Device = Viewport & {
  label: string;
};

type Enabled = {
  enabled: true;
  viewport: Viewport;
};

type Disabled = {
  enabled: false;
  viewport: null | Viewport;
};

export type ResponsivePreviewSpec = {
  name: 'responsivePreview';
  config: {
    devices: Device[];
  };
  state: Enabled | Disabled;
};
