var Cosmos = require('../build/cosmos.js'),
    React = require('react'),
    _ = require('underscore');

describe("Components implementing the PersistState mixin", function() {

  var PersistStateSpec = {
        mixins: [Cosmos.mixins.PersistState],
        render: function() {
          return React.DOM.span(null, 'nada');
        }
      },
      ParentPersistStateSpec = {
        mixins: [Cosmos.mixins.PersistState],
        render: function() {
          return this.loadChild('childRef');
        }
      };

  it("should load their state from the 'state' prop", function() {
    var PersistStateComponent = React.createClass(PersistStateSpec),
        componentInstance = PersistStateComponent({state: {foo: 'bar'}});
    // React Components need to be rendered to mount
    React.renderComponentToString(componentInstance);
    expect(componentInstance.state).toEqual({foo: 'bar'});
  });

  describe("child props", function() {

    beforeEach(function() {
      Cosmos.components.ChildComponent = React.createClass(PersistStateSpec);
    });
    afterEach(function() {
      delete Cosmos.components.ChildComponent;
    });

    it("should be read from embedded .children props", function() {
      var ComponentClass = React.createClass(ParentPersistStateSpec),
          componentInstance = ComponentClass({
            children: {
              childRef: {
                component: 'ChildComponent',
                foo: 'bar'
              }
            }
          });
      // React Components need to be rendered to mount
      React.renderComponentToString(componentInstance);
      expect(componentInstance.refs.childRef.props).toEqual({
        ref: 'childRef',
        component: 'ChildComponent',
        foo: 'bar'
      });
    });

    it("should be read from .children class handlers", function() {
      var ComponentClass = React.createClass(_.extend({
            children: {
              childRef: function() {
                return {
                  component: 'ChildComponent',
                  foo: 'bar'
                };
              }
            }
          }, ParentPersistStateSpec)),
          componentInstance = ComponentClass({});
      // React Components need to be rendered to mount
      React.renderComponentToString(componentInstance);
      expect(componentInstance.refs.childRef.props).toEqual({
        ref: 'childRef',
        component: 'ChildComponent',
        foo: 'bar'
      });
    });

    it("should extend .children props with .children class handlers", function() {
      var ComponentClass = React.createClass(_.extend({
            children: {
              childRef: function(presets) {
                return _.extend(presets, {
                  component: 'ChildComponent',
                  foo: 'barbar'
                });
              }
            }
          }, ParentPersistStateSpec)),
          componentInstance = ComponentClass({
            children: {
              childRef: {
                foo: 'bar',
                variable: false
              }
            }
          });
      // React Components need to be rendered to mount
      React.renderComponentToString(componentInstance);
      expect(componentInstance.refs.childRef.props).toEqual({
        ref: 'childRef',
        component: 'ChildComponent',
        foo: 'barbar',
        variable: false
      });
    });
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

  describe("should generate snapshot recursively", function() {

    afterEach(function() {
      delete Cosmos.components.ChildComponent;
    });

    it("if children implement PeristState", function() {
      var ComponentClass = React.createClass(ParentPersistStateSpec),
          componentInstance = ComponentClass({
            children: {
              childRef: {
                component: 'ChildComponent',
                foo: 'bar'
              }
            }
          });
      Cosmos.components.ChildComponent = React.createClass(PersistStateSpec);
      // React Components need to be rendered to mount
      React.renderComponentToString(componentInstance);
      componentInstance.refs.childRef.setState({updated: true});
      expect(componentInstance.generateSnapshot(true).children).toEqual({
        childRef: {
          ref: 'childRef',
          component: 'ChildComponent',
          foo: 'bar',
          state: {
            updated: true
          }
        }
      });
    });

    it("if children don't implement PersistState", function() {
      var ComponentClass = React.createClass(ParentPersistStateSpec),
          componentInstance = ComponentClass({
            children: {
              childRef: {
                component: 'ChildComponent',
                foo: 'bar'
              }
            }
          });
      Cosmos.components.ChildComponent = React.createClass(
        // Remove PersisState mixin
        _.extend({}, PersistStateSpec, {mixins: []}));
      // React Components need to be rendered to mount
      React.renderComponentToString(componentInstance);
      componentInstance.refs.childRef.setState({updated: true});
      expect(componentInstance.generateSnapshot(true).children).toEqual({
        childRef: {
          ref: 'childRef',
          component: 'ChildComponent',
          foo: 'bar'
        }
      });
    });
  });
});
