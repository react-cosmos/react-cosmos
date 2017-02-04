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
        extensions: ['.js', '.jsx'],
        alias: {
          helpers: path.join(__dirname, 'helpers'),
          fixtures: path.join(__dirname, 'fixtures'),
          'component-playground':
              path.join(__dirname, '../packages/react-component-playground/src'),
        },
      },
      module: {
        rules: [{
          test: /\.jsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              plugins: [
                ['istanbul', { include: ['packages/*/src/**/*.js{,x}'] }],
              ],
            },
          },
        }, {
          test: /\.less$/,
          use: [
            'style-loader',
            'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
            'less-loader',
          ],
        }, {
          test: /\.css$/,
          use: [
            'style-loader',
            'css-loader',
          ],
        }, {
          test: /\.png$/,
          use: 'url-loader'
        }],
      },
    },
    webpackMiddleware: {
      noInfo: true,
    },
  });
};
