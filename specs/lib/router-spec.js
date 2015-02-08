describe("Cosmos.Router", function() {

  var jsdom = require('jsdom');

  // jsdom creates a fresh new window object for every test case and React needs
  // to be required *after* the window and document globals are available. The
  // var references however must be declared globally in order to be accessible
  // in test cases as well.
  var React,
      utils,
      Cosmos,
      ComponentClass,
      componentElement,
      componentInstance,
      componentCallback;

  beforeEach(function() {
    global.window = jsdom.jsdom().createWindow('<html><body></body></html>');
    global.document = global.window.document;
    global.navigator = global.window.navigator;
    // We're mocking the URL of the window
    global.window.location = {href: 'mocked-location-href'};

    React = require('react/addons');
    utils = React.addons.TestUtils;
    Cosmos = require('../../build/cosmos.js');

    // Ignore native APIs
    spyOn(Cosmos.Router.prototype, '_bindPopStateEvent');
    spyOn(Cosmos.Router.prototype, '_replaceHistoryState');
    spyOn(Cosmos.Router.prototype, '_pushHistoryState');

    // The Cosmos.url lib is already tested in isolation
    spyOn(Cosmos.url, 'getParams').and.returnValue({
      component: 'List',
      dataUrl: 'users.json'
    });
    spyOn(Cosmos.url, 'isPushStateSupported').and.returnValue(true);

    // We just want a valid instance to work with, the Router props won't be
    // taken into consideration
    spyOn(Cosmos, 'render').and.callFake(function(props, container, callback) {
      componentCallback = callback;
      return componentInstance;
    });

    // Clean up previous component setups
    ComponentClass = null;
    componentElement = null;
    componentInstance = null;
  });

  describe("new instance", function() {

    it("should use props from URL query string", function() {
      var router = new Cosmos.Router();

      var propsSent = Cosmos.render.calls.mostRecent().args[0];
      expect(propsSent.component).toEqual('List');
      expect(propsSent.dataUrl).toEqual('users.json');
    });

    it("should extend default props", function() {
      var router = new Cosmos.Router({
        component: 'DefaultComponent',
        defaultProp: true
      });

      var propsSent = Cosmos.render.calls.mostRecent().args[0];
      expect(propsSent.component).toEqual('List');
      expect(propsSent.dataUrl).toEqual('users.json');
      expect(propsSent.defaultProp).toEqual(true);
    });

    it("should attach router reference to props", function() {
      var router = new Cosmos.Router();

      var propsSent = Cosmos.render.calls.mostRecent().args[0];
      expect(propsSent.router).toEqual(router);
    });

    it("should set key to current window location href", function() {
      var router = new Cosmos.Router();

      var propsSent = Cosmos.render.calls.mostRecent().args[0];
      expect(propsSent.key).toEqual('mocked-location-href');
    });

    it("should default to document.body as container", function() {
      var router = new Cosmos.Router();

      expect(Cosmos.render.calls.mostRecent().args[1]).toBe(document.body);
    });

    it("should use container node received in options", function() {
      var container = document.createElement('div');
      var router = new Cosmos.Router({}, {
        container: container
      });

      expect(Cosmos.render.calls.mostRecent().args[1]).toBe(container);
    });

    it("should call onChange callback", function() {
      var onChangeSpy = jasmine.createSpy();
      var router = new Cosmos.Router({}, {
        onChange: onChangeSpy
      });

      var propsSent = onChangeSpy.calls.mostRecent().args[0];
      // Mocked url props, tested above
      expect(propsSent.component).toEqual('List');
      expect(propsSent.dataUrl).toEqual('users.json');
    });
  });

  describe(".goTo method", function() {

    it("should use props param", function() {
      var router = new Cosmos.Router();
      router.goTo('my-page?component=List&dataUrl=users.json');

      var propsSent = Cosmos.render.calls.mostRecent().args[0];
      expect(propsSent.component).toEqual('List');
      expect(propsSent.dataUrl).toEqual('users.json');
    });

    it("should extend default props", function() {
      var router = new Cosmos.Router({
        component: 'DefaultComponent',
        defaultProp: true
      });
      router.goTo('my-page?component=List&dataUrl=users.json');

      var propsSent = Cosmos.render.calls.mostRecent().args[0];
      expect(propsSent.component).toEqual('List');
      expect(propsSent.dataUrl).toEqual('users.json');
      expect(propsSent.defaultProp).toEqual(true);
    });

    it("should attach router reference to props", function() {
      var router = new Cosmos.Router();
      router.goTo('my-page?component=List&dataUrl=users.json');

      var propsSent = Cosmos.render.calls.mostRecent().args[0];
      expect(propsSent.router).toEqual(router);
    });

    it("should set key to sent href value", function() {
      var router = new Cosmos.Router();
      router.goTo('my-page?component=List&dataUrl=users.json');

      var propsSent = Cosmos.render.calls.mostRecent().args[0];
      expect(propsSent.key).toEqual('my-page?component=List&dataUrl=users.json');
    });

    it("should push component snapshot to browser history", function() {
      ComponentClass = React.createClass({
        mixins: [Cosmos.mixins.ComponentTree],
        render: function() {
          return React.DOM.span();
        }
      });
      componentElement = React.createElement(ComponentClass);
      componentInstance = utils.renderIntoDocument(componentElement);

      // Simulate some state addition in the component
      spyOn(componentInstance, 'serialize').and.callFake(function() {
        return {
          component: 'List',
          dataUrl: 'users.json',
          state: {
            haveISeenThings: 'yes'
          }
        };
      });

      var router = new Cosmos.Router();
      router.goTo('my-page?component=List&dataUrl=users.json');

      // Simulate React.render callback call
      componentCallback.call(componentInstance);

      // The recursive snapshot should've been extracted from the component
      expect(componentInstance.serialize.calls.mostRecent().args[0])
             .toBe(true);

      // It's a bit difficult to mock the native functions so we mocked the
      // private methods that wrap those calls
      expect(router._pushHistoryState.calls.mostRecent().args[0]).toEqual({
        component: 'List',
        dataUrl: 'users.json',
        state: {
          haveISeenThings: 'yes'
        }
      });
    });

    it("shouldn't push default props to browser history", function() {
      ComponentClass = React.createClass({
        mixins: [Cosmos.mixins.ComponentTree],
        render: function() {
          return React.DOM.span();
        }
      });
      componentElement = React.createElement(ComponentClass);
      componentInstance = utils.renderIntoDocument(componentElement);

      var componentLookup = function() {
        // This won't be called because Cosmos.render is mocked
      };

      spyOn(componentInstance, 'serialize').and.callFake(function() {
        return {
          component: 'List',
          componentLookup: componentLookup,
          dataUrl: 'users.json',
          defaultProp: true
        };
      });

      var router = new Cosmos.Router({
        component: 'DefaultComponent',
        componentLookup: componentLookup,
        defaultProp: true
      });
      router.goTo('my-page?component=List&dataUrl=users.json');

      // Simulate React.render callback call
      componentCallback.call(componentInstance);

      // It's a bit difficult to mock the native functions so we mocked the
      // private methods that wrap those calls
      expect(router._pushHistoryState.calls.mostRecent().args[0]).toEqual({
        // Overridden prop
        component: 'List',
        // New prop
        dataUrl: 'users.json'
      });
    });

    it("shouldn't push router instance to browser history", function() {
      ComponentClass = React.createClass({
        mixins: [Cosmos.mixins.ComponentTree],
        render: function() {
          return React.DOM.span();
        }
      });
      componentElement = React.createElement(ComponentClass);
      componentInstance = utils.renderIntoDocument(componentElement);

      var router = new Cosmos.Router();

      spyOn(componentInstance, 'serialize').and.callFake(function() {
        return {
          component: 'List',
          dataUrl: 'users.json',
          router: router
        };
      });

      router.goTo('my-page?component=List&dataUrl=users.json');

      // Simulate React.render callback call
      componentCallback.call(componentInstance);

      // It's a bit difficult to mock the native functions so we mocked the
      // private methods that wrap those calls
      var propsSent = router._pushHistoryState.calls.mostRecent().args[0];
      expect(propsSent.router).toBe(undefined);
    });

    it("should update browser history for previous component", function() {
      /* Note: This is not a pure unit test, it depends on the internal logic
      of React components */
      ComponentClass = React.createClass({
        mixins: [Cosmos.mixins.ComponentTree],
        render: function() {
          return React.DOM.span();
        }
      });
      componentElement = React.createElement(ComponentClass, {
        component: 'List',
        dataUrl: 'users.json'
      });
      componentInstance = utils.renderIntoDocument(componentElement);

      var router = new Cosmos.Router();
      // We alter the current instance while it's bound to the current history
      // entry
      componentInstance.setProps({dataUrl: null, someNumber: 555});
      componentInstance.setState({amIState: true});

      // Before routing to a new Component configuration, the previous one
      // shouldn't been updated with our changes
      router.goTo('my-page?component=User&dataUrl=user.json');

      // It's a bit difficult to mock the native functions so we mocked the
      // private methods that wrap those calls
      expect(router._replaceHistoryState.calls.mostRecent().args[0]).toEqual({
        component: 'List',
        dataUrl: null,
        someNumber: 555,
        state: {
          amIState: true
        }
      });
    });

    it("should call onChange callback", function() {
      var onChangeSpy = jasmine.createSpy();
      var router = new Cosmos.Router({}, {
        onChange: onChangeSpy
      });
      router.goTo('my-page?component=MyComponent&myProp=true');

      var propsSent = onChangeSpy.calls.mostRecent().args[0];
      expect(propsSent.component).toEqual('MyComponent');
      expect(propsSent.myProp).toEqual(true);
    });
  });

  describe(".PopState event", function() {

    it("should use props from event state", function() {
      var router = new Cosmos.Router();
      router.onPopState({
        state: {
          component: 'List',
          dataUrl: 'users.json'
        }
      });

      var propsSent = Cosmos.render.calls.mostRecent().args[0];
      expect(propsSent.component).toEqual('List');
      expect(propsSent.dataUrl).toEqual('users.json');
    });

    it("should extend default props", function() {
      var router = new Cosmos.Router({
        component: 'DefaultComponent',
        defaultProp: true
      });
      router.onPopState({
        state: {
          component: 'List',
          dataUrl: 'users.json'
        }
      });

      var propsSent = Cosmos.render.calls.mostRecent().args[0];
      expect(propsSent.component).toEqual('List');
      expect(propsSent.dataUrl).toEqual('users.json');
      expect(propsSent.defaultProp).toEqual(true);
    });

    it("should attach router reference to props", function() {
      var router = new Cosmos.Router();
      router.onPopState({
        state: {
          component: 'List',
          dataUrl: 'users.json'
        }
      });

      var propsSent = Cosmos.render.calls.mostRecent().args[0];
      expect(propsSent.router).toEqual(router);
    });

    it("should set key to current window location href", function() {
      var router = new Cosmos.Router();
      router.onPopState({
        state: {}
      });

      var propsSent = Cosmos.render.calls.mostRecent().args[0];
      expect(propsSent.key).toEqual('mocked-location-href');
    });

    it("should call onChange callback", function() {
      var onChangeSpy = jasmine.createSpy();
      var router = new Cosmos.Router({}, {
        onChange: onChangeSpy
      });
      router.onPopState({
        state: {
          component: 'MyComponent',
          myProp: true
        }
      });

      var propsSent = onChangeSpy.calls.mostRecent().args[0];
      expect(propsSent.component).toEqual('MyComponent');
      expect(propsSent.myProp).toEqual(true);
    });
  });
});
