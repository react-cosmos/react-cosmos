export type Viewport = { width: number; height: number };

export type Device = Viewport & {
  label: string;
};

export type ResponsivePreviewSpec = {
  name: 'responsivePreview';
  config: {
    devices: Device[];
  };
  state: {
    enabled: boolean;
  };
};
