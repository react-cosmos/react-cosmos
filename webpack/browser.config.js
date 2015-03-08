var _ = require('lodash'),
    baseConfig = require('./base.config.js');

module.exports = _.merge({}, baseConfig, {
  externals: {
    'lodash': '_',
    'react/addons': 'React'
  },
  output: {
    libraryTarget: 'var',
    library: 'Cosmos',
    filename: './build/cosmos.js'
  }
});
