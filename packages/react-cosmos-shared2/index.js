// @flow

exports.RENDERER_ID = require('./dist/index').RENDERER_ID;

exports.updateItem = require('./dist/utility').updateItem;
exports.replaceOrAddItem = require('./dist/utility').replaceOrAddItem;
exports.removeItem = require('./dist/utility').removeItem;

exports.extractValuesFromObject = require('./dist/values').extractValuesFromObject;
exports.areValuesEqual = require('./dist/values').areValuesEqual;

exports.updateState = require('./dist/state').updateState;

exports.getFixtureStateProps = require('./dist/fixtureState').getFixtureStateProps;
exports.getFixtureStatePropsInst = require('./dist/fixtureState').getFixtureStatePropsInst;
exports.updateFixtureStateProps = require('./dist/fixtureState').updateFixtureStateProps;
exports.getFixtureStateState = require('./dist/fixtureState').getFixtureStateState;
exports.getFixtureStateStateInst = require('./dist/fixtureState').getFixtureStateStateInst;
exports.updateFixtureStateState = require('./dist/fixtureState').updateFixtureStateState;
