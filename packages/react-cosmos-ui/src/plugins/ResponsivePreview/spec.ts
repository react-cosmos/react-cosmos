export type ResponsiveViewport = { width: number; height: number };

export type ResponsiveDevice = ResponsiveViewport & {
  label: string;
};

export type ResponsivePreviewSpec = {
  name: 'responsivePreview';
  config: {
    devices: ResponsiveDevice[];
  };
};
