const { useRootBabelConfig } = require('../webpack');

module.exports = {
  componentPaths: ['components'],
  webpack: useRootBabelConfig
};
