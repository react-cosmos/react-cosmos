describe("Components implementing the PersistState mixin", function() {

  var _ = require('lodash'),
      jsdom = require('jsdom');

  // jsdom creates a fresh new window object for every test case and React needs
  // to be required *after* the window and document globals are available. The
  // var references however must be declared globally in order to be accessible
  // in test cases as well.
  var React,
      utils,
      Cosmos;

  beforeEach(function() {
    global.window = jsdom.jsdom().createWindow('<html><body></body></html>');
    global.document = global.window.document;
    global.navigator = global.window.navigator;

    React = require('react/addons');
    utils = React.addons.TestUtils;
    Cosmos = require('../build/cosmos.js');
  });

  // In order to avoid any sort of state between tests, even the component class
  // generated for every test case
  var generateComponentClass = function(attributes) {
    return React.createClass(_.extend({}, {
      mixins: [Cosmos.mixins.PersistState],
      render: function() {
        return React.DOM.span();
      }
    }, attributes));
  };
  var generateParentComponentClass = function(attributes) {
    return React.createClass(_.extend({}, {
      mixins: [Cosmos.mixins.PersistState],
      render: function() {
        return this.loadChild('childRef');
      }
    }, attributes));
  };

  var ComponentClass,
      componentInstance;

  it("should load their state from the 'state' prop", function() {
    ComponentClass = generateComponentClass();
    componentInstance = utils.renderIntoDocument(ComponentClass({
      state: {foo: 'bar'}
    }));
    expect(componentInstance.state).toEqual({foo: 'bar'});
  });

  describe("child", function() {

    beforeEach(function() {
      Cosmos.components.ChildComponent = generateComponentClass();
    });
    afterEach(function() {
      delete Cosmos.components.ChildComponent;
    });

    it("props should be read from .children class handlers", function() {
      ComponentClass = generateParentComponentClass({
        children: {
          childRef: function() {
            return {
              component: 'ChildComponent',
              foo: 'bar'
            };
          }
        }
      });
      componentInstance = utils.renderIntoDocument(ComponentClass());
      expect(componentInstance.refs.childRef.props).toEqual({
        ref: 'childRef',
        component: 'ChildComponent',
        foo: 'bar'
      });
    });

    it("state should be read from embedded .children state", function() {
      ComponentClass = generateParentComponentClass({
        children: {
          childRef: function() {
            return {
              component: 'ChildComponent',
              foo: 'bar'
            };
          }
        }
      });
      componentInstance = utils.renderIntoDocument(ComponentClass({
        state: {
          children: {
            childRef: {
              isThisTheLife: true
            }
          }
        }
      }));
      expect(componentInstance.refs.childRef.state).toEqual({
        isThisTheLife: true
      });
    });

    it("should use embedded .children state first and then ignore it", function() {
      ComponentClass = generateParentComponentClass({
        children: {
          childRef: function() {
            return {
              component: 'ChildComponent',
              foo: this.props.foo
            };
          }
        }
      });
      componentInstance = utils.renderIntoDocument(ComponentClass({
        foo: 'bar',
        state: {
          children: {
            childRef: {
              isThisTheLife: true,
              isThisLove: false
            }
          }
        }
      }));
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

    it("should not interfere with sibling refs", function() {
      ComponentClass = generateParentComponentClass({
        children: {
          childRef: function() {
            return {
              component: 'ChildComponent',
              foo: this.props.foo
            };
          }
        },
        render: function() {
          return React.DOM.div(null,
            React.DOM.div(null, this.loadChild('childRef')),
            React.DOM.div({ref: 'straightRef'}, this.props.foo)
          );
        }
      });
      componentInstance = utils.renderIntoDocument(ComponentClass({
        foo: 'bar'
      }));
      // Dynamic child is OK
      expect(componentInstance.refs.childRef.props).toEqual({
        ref: 'childRef',
        component: 'ChildComponent',
        foo: 'bar'
      });
      // Static child is OK
      expect(componentInstance.refs.straightRef)
            .toEqual(jasmine.any(Object));
      expect(componentInstance.refs.straightRef.getDOMNode().innerHTML)
            .toEqual('bar');
    });

    it("should not interfere with child refs", function() {
      Cosmos.components.ChildComponent = generateComponentClass({
        render: function() {
          return React.DOM.div(null,
            React.DOM.div({ref: 'Refception'}, 'one'),
            React.DOM.div({ref: 'LordOfTheRefs'}, 'two')
          );
        }
      });

      ComponentClass = generateParentComponentClass({
        children: {
          childRef: function() {
            return {
              component: 'ChildComponent'
            };
          }
        }
      });
      componentInstance = utils.renderIntoDocument(ComponentClass());
      // Ref to child
      expect(componentInstance.refs.childRef).toEqual(jasmine.any(Object));
      // Refs of child
      expect(componentInstance.refs.childRef.refs.Refception)
            .toEqual(jasmine.any(Object));
      expect(componentInstance.refs.childRef.refs.LordOfTheRefs)
            .toEqual(jasmine.any(Object));
      // Child refs contain references to DOM nodes
      expect(componentInstance.refs.childRef.refs.Refception.getDOMNode().innerHTML)
            .toEqual('one');
      expect(componentInstance.refs.childRef.refs.LordOfTheRefs.getDOMNode().innerHTML)
            .toEqual('two');
    });

    it("should propagate component lookup to children", function() {
      var customComponents = {
        StepChildComponent: generateComponentClass()
      };
      ComponentClass = generateParentComponentClass({
        children: {
          childRef: function() {
            return {
              component: 'StepChildComponent'
            };
          }
        }
      });
      componentInstance = utils.renderIntoDocument(ComponentClass({
        componentLookup: function(name) {
          expect(name).toBe('StepChildComponent');
          return customComponents[name];
        }
      }));
      // Child was found
      expect(componentInstance.refs.childRef).toEqual(jasmine.any(Object));
    });
  });

  it("should generate snapshot with exact props and state", function() {
    ComponentClass = generateComponentClass();
    componentInstance = utils.renderIntoDocument(ComponentClass({
      players: 5,
      state: {speed: 1}
    }));
    expect(componentInstance.generateSnapshot())
          .toEqual({players: 5, state: {speed: 1}});

    // Let's ensure changes are also reflected in the snapshot
    componentInstance.setProps({players: 10});
    componentInstance.setState({speed: 3});
    expect(componentInstance.generateSnapshot())
          .toEqual({players: 10, state: {speed: 3}});
  });

  it("should ignore default props when generating snapshot", function() {
    ComponentClass = generateComponentClass({
      getDefaultProps: function() {
        return {hidden: true};
      }
    });
    componentInstance = utils.renderIntoDocument(ComponentClass({
      visible: true
    }));
    expect(componentInstance.generateSnapshot()).toEqual({
      visible: true,
      state: {}
    });
  });

  it("should generate snapshot recursively", function() {
    Cosmos.components.ChildComponent = generateComponentClass();
    ComponentClass = generateParentComponentClass({
      children: {
        childRef: function() {
          return {
            component: 'ChildComponent',
            foo: 'bar'
          };
        }
      }
    });
    componentInstance = utils.renderIntoDocument(ComponentClass());
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

  it("should deep clone when generated snapshot", function() {
    var snapshot,
        nested;

    ComponentClass = generateComponentClass();
    componentInstance = utils.renderIntoDocument(ComponentClass({
      state: {
        nested: {foo: 'bar'}
      }
    }));

    snapshot = componentInstance.generateSnapshot();
    nested = componentInstance.state.nested;
    nested.foo = 'barbar';

    componentInstance.setState({nested: nested});
    expect(snapshot.state.nested.foo).toEqual('bar');
  });

  it("should deep clone when loading snapshot", function() {
    var snapshot = {
          state: {
            nested: {foo: 'bar'}
          }
        },
        nested;

    ComponentClass = generateComponentClass(),
    componentInstance = utils.renderIntoDocument(ComponentClass(snapshot));

    nested = componentInstance.state.nested;
    nested.foo = 'barbar';

    componentInstance.setState({nested: nested});
    expect(snapshot.state.nested.foo).toEqual('bar');
  });
});
