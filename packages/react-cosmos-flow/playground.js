// @flow

export type PlaygroundOpts = {
  loaderUri: string,
  projectKey: string,
  webpackConfigType: 'default' | 'custom',
  deps: {
    [string]: boolean
  }
};
