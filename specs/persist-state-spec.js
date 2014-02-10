var Fresh = require('../fresh-bundle.js'),
    React = require('react-tools').React,
    _ = require('underscore');

describe("Widgets implementing the PersistState mixin", function() {

  var PersistStateSpec = {
    mixins: [Fresh.mixins.PersistState],
    render: function() {
      return React.DOM.span(null, 'nada');
    }
  };

  it("should load their state from the 'state' prop", function() {
    var PersistStateWidget = React.createClass(PersistStateSpec),
        widgetInstance = PersistStateWidget({state: {foo: 'bar'}});
    // React Components need to be rendered to mount
    React.renderComponentToString(widgetInstance, function(){});
    expect(widgetInstance.state).toEqual({foo: 'bar'});
  });

  it("should generate snapshot with exact props and state", function() {
    var PersistStateWidget = React.createClass(PersistStateSpec),
        widgetInstance = PersistStateWidget({
          players: 5,
          state: {speed: 1}
        }),
        snapshot;
    // React Components need to be rendered to mount
    React.renderComponentToString(widgetInstance, function(){});
    expect(widgetInstance.generateConfigurationSnapshot())
      .toEqual({players: 5, state: {speed: 1}});

    // Let's ensure changes are also reflected in the snapshot
    widgetInstance.setProps({players: 10});
    widgetInstance.setState({speed: 3});
    expect(widgetInstance.generateConfigurationSnapshot())
      .toEqual({players: 10, state: {speed: 3}});
  });

  it("should ignore default props when generating snapshot", function() {
    var CustomPersistStateSpec = _.extend({getDefaultProps: function() {
          return {hidden: true};
        }}, PersistStateSpec),
        PersistStateWidget = React.createClass(CustomPersistStateSpec),
        widgetInstance = PersistStateWidget({
          visible: true
        });
    // React Components need to be rendered to mount
    React.renderComponentToString(widgetInstance, function(){});
    expect(widgetInstance.generateConfigurationSnapshot())
      .toEqual({visible: true});
  });

  it("should generate URI with escaped props and state", function() {
    var PersistStateWidget = React.createClass(PersistStateSpec),
        widgetInstance = PersistStateWidget({
          players: 5,
          state: {speed: 1}
        }),
        snapshot;
    // React Components need to be rendered to mount
    React.renderComponentToString(widgetInstance, function(){});
    expect(widgetInstance.getUriQueryString())
      // encodeURIComponent(JSON.stringify({speed:1}))
      .toEqual('players=5&state=%7B%22speed%22%3A1%7D');
  });
});
