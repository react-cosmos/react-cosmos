module.exports = function(config) {
  config.set({
    basePath: 'tests/',
    browsers: [
      'PhantomJS'
    ],
    files: [
      'bind-polyfill.js',
      'cosmos.js',
      'lib/**/*.js',
      'mixins/**/*.js',
      'components/**/*.js'
    ],
    frameworks: ['mocha', 'chai', 'sinon-chai'],
    preprocessors: {
      '**/*.js': ['webpack']
    },
    webpack: {
      module: {
        loaders: [{
          test: /\.jsx$/,
          loader: 'jsx-loader'
        }, {
          test: /\.less$/,
          loader: 'style-loader!css-loader!less-loader'
        }]
      }
    },
    webpackMiddleware: {
      noInfo: true
    }
  });
};
