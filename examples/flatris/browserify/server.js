
const path = require('path');
const budo = require('budo');

const onConnect = ev => {
  console.log('Server running on %s', ev.uri);
};
const onUpdate = buffer => {
  console.log('bundle - %d bytes', buffer.length);
};
const browserify = {
  transform: ['babelify', 'require-globify', 'node-lessify'],
  extensions: ['.js', '.json', '.jsx'],
};

budo(path.join(__dirname, 'playground'), {
  live: false,
  host: 'localhost',
  port: 8990,
  browserify,
}).on('connect', onConnect).on('update', onUpdate);

budo(path.join(__dirname, 'loader'), {
  live: true,
  host: 'localhost',
  port: 8991,
  browserify,
}).on('update', onUpdate);
