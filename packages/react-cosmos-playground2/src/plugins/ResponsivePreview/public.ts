export type Viewport = { width: number; height: number };

export type Device = Viewport & {
  label: string;
};

export type ResponsivePreviewSpec = {
  name: 'responsivePreview';
  // state: {
  //   enabled: boolean;
  //   scaled: boolean;
  //   viewport: Viewport;
  // };
  config: {
    devices: Device[];
  };
};
