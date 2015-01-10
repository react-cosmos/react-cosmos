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
      componentElement,
      componentInstance;

  it("should load their state from the 'state' prop", function() {
    ComponentClass = generateComponentClass();
    componentElement = React.createElement(ComponentClass, {
      state: {foo: 'bar'}
    });
    componentInstance = utils.renderIntoDocument(componentElement);

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
      componentElement = React.createElement(ComponentClass);
      componentInstance = utils.renderIntoDocument(componentElement);

      expect(componentInstance.refs.childRef.props).toEqual({
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
      componentElement = React.createElement(ComponentClass, {
        state: {
          children: {
            childRef: {
              isThisTheLife: true
            }
          }
        }
      });
      componentInstance = utils.renderIntoDocument(componentElement);

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
      componentElement = React.createElement(ComponentClass, {
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
      componentInstance = utils.renderIntoDocument(componentElement);

      expect(componentInstance.refs.childRef.props).toEqual({
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
      componentElement = React.createElement(ComponentClass, {
        foo: 'bar'
      });
      componentInstance = utils.renderIntoDocument(componentElement);

      // Dynamic child is OK
      expect(componentInstance.refs.childRef.props).toEqual({
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
      componentElement = React.createElement(ComponentClass);
      componentInstance = utils.renderIntoDocument(componentElement);

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
      componentElement = React.createElement(ComponentClass, {
        componentLookup: function(name) {
          expect(name).toBe('StepChildComponent');
          return customComponents[name];
        }
      });
      componentInstance = utils.renderIntoDocument(componentElement);

      // Child was found
      expect(componentInstance.refs.childRef).toEqual(jasmine.any(Object));
    });
  });

  it("should generate snapshot with exact props and state", function() {
    ComponentClass = generateComponentClass();
    componentElement = React.createElement(ComponentClass, {
      players: 5,
      state: {speed: 1}
    });
    componentInstance = utils.renderIntoDocument(componentElement);

    expect(componentInstance.generateSnapshot())
          .toEqual({players: 5, state: {speed: 1}});

    // Let's ensure changes are also reflected in the snapshot
    componentInstance.setProps({players: 10});
    componentInstance.setState({speed: 3});
    expect(componentInstance.generateSnapshot())
          .toEqual({players: 10, state: {speed: 3}});
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
    componentElement = React.createElement(ComponentClass);
    componentInstance = utils.renderIntoDocument(componentElement);
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
    componentElement = React.createElement(ComponentClass, {
      state: {
        nested: {foo: 'bar'}
      }
    });
    componentInstance = utils.renderIntoDocument(componentElement);

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
    componentElement = React.createElement(ComponentClass, snapshot);
    componentInstance = utils.renderIntoDocument(componentElement);

    nested = componentInstance.state.nested;
    nested.foo = 'barbar';

    componentInstance.setState({nested: nested});
    expect(snapshot.state.nested.foo).toEqual('bar');
  });


  describe("PersistState: dynamic children", function() {
    var chidren, childSpy;

    beforeEach(function() {
      children = {
        childRef: function(customRef) {
          return {
            foo: 'bar',
            ref: customRef
          };
        }
      };
      childSpy = spyOn(children, 'childRef').and.callThrough();

      spyOn(Cosmos, 'createElement').and.returnValue(React.createElement('div'));
    });

    it("should pass in empty arguments", function() {
      ComponentClass = generateParentComponentClass({
        children: children,
        render: function() {
          return this.loadChild('childRef');
        }
      });
      componentElement = React.createElement(ComponentClass);
      componentInstance = utils.renderIntoDocument(componentElement);

      expect(childSpy).toHaveBeenCalledWith();
    });

    it("should pass in the correct arguments", function() {
      ComponentClass = generateParentComponentClass({
        children: children,
        render: function() {
          return this.loadChild('childRef', 'bar', 'baz');
        }
      });
      componentElement = React.createElement(ComponentClass);
      componentInstance = utils.renderIntoDocument(componentElement);

      expect(childSpy).toHaveBeenCalledWith('bar', 'baz');
    });

    it("should set the correct ref when it is passed in", function() {
      ComponentClass = generateParentComponentClass({
        children: children,
        render: function() {
          return this.loadChild('childRef', 'newRefName', 'baz');
        }
      });
      componentElement = React.createElement(ComponentClass);
      componentInstance = utils.renderIntoDocument(componentElement);

      expect(Cosmos.createElement).toHaveBeenCalledWith({
        foo: 'bar',
        ref: 'newRefName'
      });
    });

    it("should set the correct ref when it is not passed in", function() {
      ComponentClass = generateParentComponentClass({
        children: children,
        render: function() {
          return this.loadChild('childRef');
        }
      });
      componentElement = React.createElement(ComponentClass);
      componentInstance = utils.renderIntoDocument(componentElement);

      expect(Cosmos.createElement).toHaveBeenCalledWith({
        foo: 'bar',
        ref: 'childRef'
      });
    });
  });
});
