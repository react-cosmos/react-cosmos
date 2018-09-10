const { useRootBabelConfig } = require('../webpack');

module.exports = {
  next: true,
  webpack: useRootBabelConfig
};
