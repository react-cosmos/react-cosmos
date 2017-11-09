// @flow

type ExcludePattern = string | RegExp;

export type ExcludePatterns = ExcludePattern | Array<ExcludePattern>;

export type PlaygroundOpts = {
  loaderUri: string,
  projectKey: string,
  webpackConfigType: 'default' | 'custom'
};

export type RuntimeErrorMessageData = {
  type: 'runtimeError'
};

export type LoaderReadyMessageData = {
  type: 'loaderReady',
  fixtures: Object
};

export type FixtureListUpdateMessageData = {
  type: 'fixtureListUpdate',
  fixtures: Object
};

export type FixtureLoadMessageData = {
  type: 'fixtureLoad',
  fixtureBody: Object
};

export type FixtureUpdateData = {
  type: 'fixtureUpdate',
  fixtureBody: Object
};

export type LoaderMessage = {
  data:
    | RuntimeErrorMessageData
    | LoaderReadyMessageData
    | FixtureListUpdateMessageData
    | FixtureLoadMessageData
    | FixtureUpdateData
};
