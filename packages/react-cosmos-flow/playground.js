// @flow

export type PlaygroundWebOpts = {
  projectKey: string,
  loaderTransport: 'postMessage',
  loaderUri: string,
  webpackConfigType: 'default' | 'custom',
  deps: {
    [string]: boolean
  }
};

export type PlaygroundNativeOpts = {
  projectKey: string,
  loaderTransport: 'websockets'
};

export type PlaygroundOpts = PlaygroundWebOpts | PlaygroundNativeOpts;
