export type Viewport = { width: number; height: number };

export type ResponsiveDevice = Viewport & {
  label: string;
};

export type ResponsivePreviewSpec = {
  name: 'responsivePreview';
  config: {
    devices: ResponsiveDevice[];
  };
};
