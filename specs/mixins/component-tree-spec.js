describe("Components implementing the ComponentTree mixin", function() {

  var _ = require('lodash'),
      jsdom = require('jsdom');

  // jsdom creates a fresh new window object for every test case and React needs
  // to be required *after* the window and document globals are available. The
  // var references however must be declared globally in order to be accessible
  // in test cases as well.
  var React,
      utils,
      Cosmos,
      componentClassSpec,
      ComponentClass,
      componentProps,
      componentElement,
      componentInstance;

  var renderComponent = function() {
    ComponentClass = React.createClass(componentClassSpec);
    componentElement = React.createElement(ComponentClass, componentProps);
    componentInstance = utils.renderIntoDocument(componentElement);
  };

  beforeEach(function() {
    global.window = jsdom.jsdom().createWindow('<html><body></body></html>');
    global.document = global.window.document;
    global.navigator = global.window.navigator;

    React = require('react/addons');
    utils = React.addons.TestUtils;
    Cosmos = require('../../build/cosmos.js');

    // The class spec and props will be extended or overriden in each test
    componentClassSpec = {
      mixins: [Cosmos.mixins.ComponentTree],

      render: function() {
        return React.DOM.span();
      }
    };
    componentProps = {};
  });

  describe("loading children", function() {

    beforeEach(function() {
      spyOn(Cosmos, 'createElement');
    });

    it("should use props from .children function", function() {
      componentClassSpec.children = {
        son: function() {
          return {
            component: 'Child',
            age: 13
          };
        }
      };

      renderComponent();
      componentInstance.loadChild('son');

      var createElementProps = Cosmos.createElement.calls.mostRecent().args[0];
      expect(createElementProps.component).toBe('Child');
      expect(createElementProps.age).toBe(13);
    });

    it("should default ref to .children key", function() {
      componentClassSpec.children = {
        son: function() {
          return {};
        }
      };

      renderComponent();
      componentInstance.loadChild('son');

      var createElementProps = Cosmos.createElement.calls.mostRecent().args[0];
      expect(createElementProps.ref).toBe('son');
    });

    it("should use ref from .children function when specified", function() {
      componentClassSpec.children = {
        son: function() {
          return {
            component: 'Child',
            ref: 'junior'
          };
        }
      };

      renderComponent();
      componentInstance.loadChild('son');

      var createElementProps = Cosmos.createElement.calls.mostRecent().args[0];
      expect(createElementProps.ref).toBe('junior');
    });

    it("should pass on component lookup to children", function() {
      componentClassSpec.children = {
        son: function() {
          return {};
        }
      };

      var gimmeComponents = function() {};
      componentProps = {
        componentLookup: gimmeComponents
      };

      renderComponent();
      componentInstance.loadChild('son');

      var createElementProps = Cosmos.createElement.calls.mostRecent().args[0];
      expect(createElementProps.componentLookup).toBe(gimmeComponents);
    });

    it("should pass extra loadChild args to children function", function() {
      var childSpy = jasmine.createSpy();

      componentClassSpec.children = {
        son: childSpy
      };

      renderComponent();
      componentInstance.loadChild('son', 'one', 'two', 'three');

      expect(childSpy).toHaveBeenCalledWith('one', 'two', 'three');
    });
  });

  describe("loading missing children", function() {

    beforeEach(function() {
      spyOn(Cosmos, 'createElement').and.callFake(function() {
        throw new Error('Invalid component');
      });

      spyOn(console, 'error');

      componentClassSpec.children ={
        son: function() {
          return {
            component: 'MissingChild'
          };
        }
      };
    });

    it("should not throw error", function() {
      var whereAreYouSon = function() {
        renderComponent();
        componentInstance.loadChild('son');
      };

      expect(whereAreYouSon).not.toThrow();
    });

    it("should call console.error", function() {
      renderComponent();
      componentInstance.loadChild('son');

      var error = new Error('Invalid component');
      expect(console.error).toHaveBeenCalledWith(error);
    });
  });

  describe("injecting state", function() {

    beforeEach(function() {
      spyOn(Cosmos, 'createElement');
    });

    it("should load their state from the state prop", function() {
      componentProps.state = {
        mood: 'indiferent',
        nevermind: true
      };

      renderComponent();

      expect(componentInstance.state.mood).toBe('indiferent');
      expect(componentInstance.state.nevermind).toBe(true);
    });

    it("should extend received state with initial state", function() {
      componentClassSpec.getInitialState = function() {
        return {
          always: 'curious'
        };
      };

      componentProps.state = {
        mood: 'indiferent'
      };

      renderComponent();

      expect(componentInstance.state.mood).toBe('indiferent');
      expect(componentInstance.state.always).toBe('curious');
    });

    describe("recursively", function() {

      beforeEach(function() {
        componentClassSpec.children = {
          son: function() {
            return {};
          }
        };
        componentClassSpec.render = function() {
          return React.DOM.div({}, this.loadChild('son'));
        };

        componentProps.state = {
          children: {
            son: {
              witty: true
            }
          }
        };
      });

      it("should inject state into children recursively", function() {
        renderComponent();

        var createElementProps = Cosmos.createElement.calls.mostRecent().args[0];
        expect(createElementProps.state.witty).toBe(true);
      });

      it("shouldn't send state to children after the first time", function() {
        renderComponent();
        componentInstance.forceUpdate();

        var createElementProps = Cosmos.createElement.calls.mostRecent().args[0];
        expect(createElementProps.state).toBe(undefined);
      });
    });

    it("should inject state into children with dynamic refs", function() {
      componentClassSpec.children = {
        son: function(nr) {
          return {
            ref: 'son' + nr
          };
        }
      };
      componentClassSpec.render = function() {
        return React.DOM.div({}, [this.loadChild('son', 1),
                                  this.loadChild('son', 2)]);
      };

      componentProps.state = {
        children: {
          son1: {
            witty: true
          },
          son2: {
            witty: false
          }
        }
      };

      renderComponent();

      var createElementCalls = Cosmos.createElement.calls.allArgs();
      expect(createElementCalls[0][0].state.witty).toBe(true);
      expect(createElementCalls[1][0].state.witty).toBe(false);
    });
  });

  describe("serializing", function() {

    beforeEach(function() {
      spyOn(Cosmos, 'createElement');
    });

    it("should generate snapshot with props", function() {
      renderComponent();
      componentInstance.setProps({
        players: 5
      });

      var snapshot = componentInstance.serialize();
      expect(snapshot.players).toBe(5);
    });

    it("should omit state prop", function() {
      renderComponent();
      componentInstance.setProps({
        state: {}
      });

      var snapshot = componentInstance.serialize();
      expect(snapshot.state).toBe(undefined);
    });

    it("should generate snapshot with state", function() {
      renderComponent();
      componentInstance.setState({
        speed: 1
      });

      var snapshot = componentInstance.serialize();
      expect(snapshot.state.speed).toBe(1);
    });

    it("should omit children state key", function() {
      renderComponent();
      componentInstance.setState({
        speed: 1,
        children: {}
      });

      var snapshot = componentInstance.serialize();
      expect(snapshot.state.children).toBe(undefined);
    });

    it("should generate snapshot with nested child state", function() {
      componentClassSpec.children = {
        son: function() {
          return {};
        }
      };

      renderComponent();

      // Fake a child instance with a serialize implementation
      componentInstance.refs = {
        son: {
          serialize: function() {
            return {
              component: 'Child',
              state: {
                age: 5
              }
            };
          }
        }
      };

      var snapshot = componentInstance.serialize(true);
      expect(snapshot.state.children.son.age).toBe(5);
    });
  });
});
