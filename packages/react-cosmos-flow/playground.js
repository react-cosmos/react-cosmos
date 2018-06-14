// @flow

export type PlaygroundWebOpts = {
  platform: 'web',
  projectKey: string,
  loaderUri: string,
  webpackConfigType: 'default' | 'custom',
  responsiveDevices?: Array<{| label: string, width: number, height: number |}>,
  deps: {
    [string]: boolean
  }
};

export type PlaygroundNativeOpts = {
  platform: 'native',
  projectKey: string
};

export type PlaygroundOpts = PlaygroundWebOpts | PlaygroundNativeOpts;
