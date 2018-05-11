// @flow

// Keeping nested "uri" export to maintain backwards compatibility
exports.uri = {
  parseLocation: require('./src/uri').parseLocation,
  stringifyParams: require('./src/uri').stringifyParams
};
exports.Router = require('./src/router').Router;
