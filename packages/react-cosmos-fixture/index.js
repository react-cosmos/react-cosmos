// @flow

// Use in custom integrations
exports.FixtureConnect = require('./dist/FixtureConnect').FixtureConnect;
exports.PostMessage = require('./dist/FixtureConnect/PostMessage').PostMessage;
exports.WebSockets = require('./dist/FixtureConnect/WebSockets').WebSockets;
exports.FixtureProvider = require('./dist/FixtureProvider').FixtureProvider;

// Use in decorators
exports.FixtureContext = require('./dist/FixtureContext').FixtureContext;

// Use in fixtures
exports.CaptureProps = require('./dist/CaptureProps').CaptureProps;
exports.ComponentState = require('./dist/ComponentState').ComponentState;
