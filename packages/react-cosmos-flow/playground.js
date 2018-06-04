// @flow

export type PlaygroundOpts = {
  loaderUri: string,
  projectKey: string,
  webpackConfigType: 'default' | 'custom',
  responsiveDevices?: Array<{| label: string, width: number, height: number |}>,
  deps: {
    [string]: boolean
  }
};
