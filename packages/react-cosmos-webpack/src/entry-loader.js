import loaderUtils from 'loader-utils';

module.exports = function embedModules(source) {
  const { components, fixtures } = loaderUtils.parseQuery(this.query);

  return source
    .replace(/COMPONENTS/g, components)
    .replace(/FIXTURES/g, fixtures);
};
