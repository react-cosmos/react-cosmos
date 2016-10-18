import loaderUtils from 'loader-utils';

module.exports = function embedModules(source) {
  const { components, fixtures } = loaderUtils.parseQuery(this.query);

  return source
    .replace(/COMPONENTS/g, unescape(components))
    .replace(/FIXTURES/g, unescape(fixtures));
};
