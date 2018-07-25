// @flow

export type ResponsiveDevices = Array<{|
  label: string,
  width: number,
  height: number
|}>;

export type PlaygroundWebOpts = {
  platform: 'web',
  projectKey: string,
  loaderUri: string,
  webpackConfigType: 'default' | 'custom',
  // TODO: responsivePreview.devices
  responsiveDevices?: ResponsiveDevices,
  deps: {
    [string]: boolean
  }
};

export type PlaygroundNativeOpts = {
  platform: 'native',
  projectKey: string
};

export type PlaygroundOpts = PlaygroundWebOpts | PlaygroundNativeOpts;
