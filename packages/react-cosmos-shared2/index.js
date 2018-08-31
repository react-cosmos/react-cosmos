// @flow

exports.RENDERER_ID = 'only-one-renderer-connection-supported-atm';

exports.updateItem = require('./dist/utility').updateItem;
exports.replaceOrAddItem = require('./dist/utility').replaceOrAddItem;

exports.extractValuesFromObject = require('./dist/values').extractValuesFromObject;

exports.updateState = require('./dist/state').updateState;

exports.getFixtureStateProps = require('./dist/fixtureState').getFixtureStateProps;
exports.getFixtureStatePropsInst = require('./dist/fixtureState').getFixtureStatePropsInst;
exports.setFixtureStateProps = require('./dist/fixtureState').setFixtureStateProps;
exports.resetFixtureStateProps = require('./dist/fixtureState').resetFixtureStateProps;
exports.getFixtureStateState = require('./dist/fixtureState').getFixtureStateState;
exports.getFixtureStateStateInst = require('./dist/fixtureState').getFixtureStateStateInst;
exports.setFixtureStateState = require('./dist/fixtureState').setFixtureStateState;
