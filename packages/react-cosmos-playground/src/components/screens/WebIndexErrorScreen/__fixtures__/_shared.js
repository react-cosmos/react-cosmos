// @flow

export function getOptions({
  webpackConfigType,
  htmlPlugin
}: {
  webpackConfigType: 'default' | 'custom',
  htmlPlugin: boolean
}) {
  return {
    platform: 'web',
    projectKey: 'foo',
    loaderUri: '/foo',
    webpackConfigType,
    deps: {
      'html-webpack-plugin': htmlPlugin
    },
    plugin: {}
  };
}
