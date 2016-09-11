const path = require('path');

module.exports = function setKarmaConfig(config) {
  config.set({
    basePath: '../',
    browsers: ['PhantomJS'],
    browserNoActivityTimeout: 30000,
    coverageReporter: {
      type: 'lcov',
      dir: 'test/coverage/',
    },
    files: [
      'test/bind-polyfill.js',
      'packages/*/test/**/*.js',
    ],
    frameworks: ['mocha', 'chai', 'sinon-chai'],
    reporters: ['mocha', 'coverage'],
    preprocessors: {
      'packages/**/*.js': ['webpack'],
    },
    webpack: {
      resolve: {
        extensions: ['', '.js', '.jsx'],
        alias: {
          helpers: path.join(__dirname, 'helpers'),
          fixtures: path.join(__dirname, 'fixtures'),
          'component-playground':
              path.join(__dirname, '../packages/react-component-playground/src'),
        },
      },
      module: {
        loaders: [{
          test: /\.jsx?$/,
          exclude: /node_modules/,
          loader: 'babel',
          query: {
            plugins: [
              ['istanbul', { include: ['packages/*/src/**/*.js{,x}'] }],
            ],
          },
        }, {
          test: /\.less$/,
          loader: 'style!css?modules&importLoaders=1' +
              '&localIdentName=[name]__[local]___[hash:base64:5]!less',
        }, {
          test: /\.css$/,
          loader: 'style!css',
        }],
      },
    },
    webpackMiddleware: {
      noInfo: true,
    },
  });
};
