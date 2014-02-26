var Fresh = require('../build/fresh.js'),
    React = require('react'),
    _ = require('underscore');

describe("Components implementing the PersistState mixin", function() {

  var PersistStateSpec = {
    mixins: [Fresh.mixins.PersistState],
    render: function() {
      return React.DOM.span(null, 'nada');
    }
  };

  it("should load their state from the 'state' prop", function() {
    var PersistStateComponent = React.createClass(PersistStateSpec),
        componentInstance = PersistStateComponent({state: {foo: 'bar'}});
    // React Components need to be rendered to mount
    React.renderComponentToString(componentInstance);
    expect(componentInstance.state).toEqual({foo: 'bar'});
  });

  it("should generate snapshot with exact props and state", function() {
    var PersistStateComponent = React.createClass(PersistStateSpec),
        componentInstance = PersistStateComponent({
          players: 5,
          state: {speed: 1}
        }),
        snapshot;
    // React Components need to be rendered to mount
    React.renderComponentToString(componentInstance);
    expect(componentInstance.generateSnapshot())
      .toEqual({players: 5, state: {speed: 1}});

    // Let's ensure changes are also reflected in the snapshot
    componentInstance.setProps({players: 10});
    componentInstance.setState({speed: 3});
    expect(componentInstance.generateSnapshot())
      .toEqual({players: 10, state: {speed: 3}});
  });

  it("should ignore default props when generating snapshot", function() {
    var CustomPersistStateSpec = _.extend({getDefaultProps: function() {
          return {hidden: true};
        }}, PersistStateSpec),
        PersistStateComponent = React.createClass(CustomPersistStateSpec),
        componentInstance = PersistStateComponent({
          visible: true
        });
    // React Components need to be rendered to mount
    React.renderComponentToString(componentInstance);
    expect(componentInstance.generateSnapshot())
      .toEqual({visible: true});
  });

  it("should generate URI with escaped props and state", function() {
    var PersistStateComponent = React.createClass(PersistStateSpec),
        componentInstance = PersistStateComponent({
          players: 5,
          state: {speed: 1}
        }),
        snapshot;
    // React Components need to be rendered to mount
    React.renderComponentToString(componentInstance);
    expect(componentInstance.generateQueryString())
      // encodeURIComponent(JSON.stringify({speed:1}))
      .toEqual('players=5&state=%7B%22speed%22%3A1%7D');
  });
});
