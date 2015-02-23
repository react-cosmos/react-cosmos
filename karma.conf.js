module.exports = function(config) {
  config.set({
    frameworks: ['mocha', 'chai', 'sinon-chai'],
    basePath: 'tests/',
    files: [
      '**/*.js'
    ],
    preprocessors: {
      '**/*.js': ['webpack']
    },
    webpack: {
      loaders: [{
        test: /\.jsx$/,
        loader: 'jsx-loader'
      }]
    },
    webpackMiddleware: {
      noInfo: true
    },
    browsers: [
      'PhantomJS'
    ]
  });
};
