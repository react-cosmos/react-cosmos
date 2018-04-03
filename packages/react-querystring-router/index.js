// Keeping nested "uri" export to maintain backwards compatibility
exports.uri = {
  parseLocation: require('./lib/uri').parseLocation,
  stringifyParams: require('./lib/uri').stringifyParams
};
exports.Router = require('./lib/router').Router;
