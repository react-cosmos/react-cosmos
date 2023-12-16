import { Viewport } from 'react-cosmos-core';

export type ResponsiveDevice = Viewport & {
  label: string;
};

export type ResponsivePreviewSpec = {
  name: 'responsivePreview';
  config: {
    devices: ResponsiveDevice[];
  };
};
