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

  describe("child", function() {

    beforeEach(function() {
      Cosmos.components.ChildComponent = React.createClass(PersistStateSpec);
    });
    afterEach(function() {
      delete Cosmos.components.ChildComponent;
    });

    it("props should be read from .children class handlers", function() {
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

    it("state should be read from embedded .children state", function() {
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
          componentInstance = ComponentClass({
            state: {
              children: {
                childRef: {
                  isThisTheLife: true
                }
              }
            }
          });
      // React Components need to be rendered to mount
      React.renderComponentToString(componentInstance);
      expect(componentInstance.refs.childRef.state).toEqual({
        isThisTheLife: true
      });
    });

    it("should use embedded .children state first and then ignore it", function() {
      var ComponentClass = React.createClass(_.extend({
            children: {
              childRef: function() {
                return {
                  component: 'ChildComponent',
                  foo: this.props.foo
                };
              }
            }
          }, ParentPersistStateSpec)),
          componentInstance = ComponentClass({
            foo: 'bar',
            state: {
              children: {
                childRef: {
                  isThisTheLife: true,
                  isThisLove: false
                }
              }
            }
          });
      // React Components need to be rendered to mount
      React.renderComponentToString(componentInstance);
      expect(componentInstance.refs.childRef.props).toEqual({
        ref: 'childRef',
        component: 'ChildComponent',
        foo: 'bar',
        state: {
          isThisTheLife: true,
          isThisLove: false
        }
      });
      expect(componentInstance.refs.childRef.state).toEqual({
        isThisTheLife: true,
        isThisLove: false
      });
      // Child state should be preserved even after re-rendering parent
      componentInstance.refs.childRef.setState({isThisLove: true});
      // Re-render parent and child implicitly
      componentInstance.setProps({foo: 'barbar'});
      // Child state is no longer embedded when re-rendered by the parent
      expect(componentInstance.refs.childRef.props).toEqual({
        ref: 'childRef',
        component: 'ChildComponent',
        foo: 'barbar'
      });
      expect(componentInstance.refs.childRef.state).toEqual({
        isThisTheLife: true,
        isThisLove: true
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
    expect(componentInstance.generateSnapshot()).toEqual({
      visible: true,
      state: {}
    });
  });

  it("should generate snapshot recursively", function() {
    Cosmos.components.ChildComponent = React.createClass(PersistStateSpec);
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
    componentInstance.refs.childRef.setState({updated: true});
    expect(componentInstance.generateSnapshot(true)).toEqual({
      state: {
        children: {
          childRef: {
            updated: true
          }
        }
      }
    });
    delete Cosmos.components.ChildComponent;
  });
});
