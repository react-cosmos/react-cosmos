const path = require('path');
const budo = require('budo');
const babelify = require('babelify');
const requireGlobify = require('require-globify');
const browserifyPostCSS = require('browserify-postcss');

budo(path.join(__dirname, 'index'), {
  live: true,
  host: 'localhost',
  port: 8990,
  browserify: {
    transform: [babelify, requireGlobify, [browserifyPostCSS, {
      plugin: [
        'postcss-nested',
      ],
      inject: true,
    }]],
  },
}).on('connect', function (ev) {
  console.log('Server running on %s', ev.uri);
  console.log('LiveReload running on port %s', ev.livePort);
}).on('update', function (buffer) {
  console.log('bundle - %d bytes', buffer.length);
});
