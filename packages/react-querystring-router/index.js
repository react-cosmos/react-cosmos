// @flow

// Keeping nested "uri" export to maintain backwards compatibility
exports.uri = {
  parseLocation: require('./dist/uri').parseLocation,
  stringifyParams: require('./dist/uri').stringifyParams
};
exports.Router = require('./dist/router').Router;
