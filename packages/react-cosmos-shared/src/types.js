// @flow

type ExcludePattern = string | RegExp;

export type ExcludePatterns = ExcludePattern | Array<ExcludePattern>;

export type PlaygroundOpts = {
  loaderUri: string,
  projectKey: string,
  webpackConfigType: 'default' | 'custom'
};
