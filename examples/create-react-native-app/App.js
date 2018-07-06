module.exports = global.__DEV__
  ? require('./App.cosmos')
  : require('./App.main');
