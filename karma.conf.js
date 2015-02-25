module.exports = function(config) {
  config.set({
    basePath: 'tests/',
    browsers: [
      'PhantomJS'
    ],
    files: [
      '**/*.js'
    ],
    frameworks: ['mocha', 'chai', 'sinon-chai'],
    preprocessors: {
      '**/*.js': ['webpack']
    },
    reporters: ['mocha'],
    webpack: {
      module: {
        loaders: [{
          test: /\.jsx$/,
          loader: 'jsx-loader'
        }]
      }
    },
    webpackMiddleware: {
      noInfo: true
    }
  });
};
