describe("Cosmos", function() {

  var _ = require('lodash'),
      jsdom = require('jsdom');

  // jsdom creates a fresh new window object for every test case and React needs
  // to be required *after* the window and document globals are available. The
  // var references however must be declared globally in order to be accessible
  // in test cases as well.
  var React,
      utils,
      Cosmos,
      DummyComponentClass;

  beforeEach(function() {
    global.window = jsdom.jsdom().createWindow('<html><body></body></html>');
    global.document = global.window.document;
    global.navigator = global.window.navigator;

    React = require('react/addons');
    utils = React.addons.TestUtils;
    Cosmos = require('../build/cosmos.js');

    DummyComponentClass = React.createClass({
      render: function() {
        return React.DOM.span();
      }
    });
  });

  it("should draw its components from the Cosmos.components namespace", function() {
    Cosmos.components.Dummy = DummyComponentClass;

    expect(Cosmos.getComponentByName('Dummy')).toBe(DummyComponentClass);

    delete Cosmos.components.Dummy;
  });

  it("should call component lookup callback with name", function() {
    var calledWithName,
    componentLookup = function(name) {
      calledWithName = name;
    };

    Cosmos.getComponentByName('Dummy', componentLookup);

    expect(calledWithName).toBe('Dummy');
  });

  it("should draw its components from lookup callback", function() {
    var componentLookup = function(name) {
      return DummyComponentClass;
    };

    expect(Cosmos.getComponentByName('Dummy', componentLookup))
           .toBe(DummyComponentClass);
  });

  describe(".createElement", function() {

    beforeEach(function() {
      spyOn(React, 'createElement');
    });

    it("should create React element for component class", function() {
      spyOn(Cosmos, 'getComponentByName').and.returnValue(DummyComponentClass);

      // No need for a component lookup since we mocked
      // Cosmos.getComponentByName
      Cosmos.createElement({
        component: 'Dummy'
      });

      expect(React.createElement.calls.mostRecent().args[0])
             .toBe(DummyComponentClass);
    });

    it("should create component element with props", function() {
      spyOn(Cosmos, 'getComponentByName').and.returnValue(DummyComponentClass);

      // No need for a component lookup since we mocked
      // Cosmos.getComponentByName
      var props = {
        component: 'Dummy'
      };
      Cosmos.createElement(props);

      expect(React.createElement.calls.mostRecent().args[1])
             .toEqual(props);
    });

    it("shouldn't instantiate component that's not a function", function() {
      Cosmos.components.NotAFunction1 = 5;
      Cosmos.components.NotAFunction2 = "string";
      Cosmos.components.NotAFunction3 = [1, 2, 3];
      Cosmos.components.NotAFunction4 = {x: true};

      expect(function() {
        Cosmos.createElement({component: 'NotAFunction1'});
      }).toThrow();

      expect(function() {
        Cosmos.createElement({component: 'NotAFunction2'});
      }).toThrow();

      expect(function() {
        Cosmos.createElement({component: 'NotAFunction3'});
      }).toThrow();

      expect(function() {
        Cosmos.createElement({component: 'NotAFunction4'});
      }).toThrow();

      delete Cosmos.components.NotAFunction1;
      delete Cosmos.components.NotAFunction2;
      delete Cosmos.components.NotAFunction3;
      delete Cosmos.components.NotAFunction4;
    });
  })

  describe(".render", function() {

    beforeEach(function() {
      spyOn(Cosmos, 'createElement');
      spyOn(React, 'render');
      spyOn(React, 'renderToString');
    });

    it("should render to DOM if received a container", function() {
      Cosmos.render({component: 'Dummy'}, '<div>');

      expect(React.render.calls.count()).toBe(1);
    });

    it("should pass DOM container to React.render", function() {
      var container = document.createElement('div');
      Cosmos.render({component: 'Dummy'}, container);

      expect(React.render.calls.mostRecent().args[1]).toBe(container);
    });

    it("should render to string if didn't receive a container", function() {
      Cosmos.render({component: 'Dummy'});

      expect(React.renderToString.calls.count()).toBe(1);
    });

    it("should create element with the same props", function() {
      var props = {
        component: 'FakeComponent',
        foo: 'bar'
      };
      Cosmos.render(props);

      expect(Cosmos.createElement.calls.mostRecent().args[0]).toBe(props);
    });
  });

  describe(".start", function() {

    var routerInstance = {};

    beforeEach(function() {
      spyOn(Cosmos, 'Router').and.returnValue(routerInstance);
    });

    it("should instantiate the Router", function() {
      Cosmos.start();

      expect(Cosmos.Router.calls.count()).toBe(1);
    });

    it("should pass args to Router constructor", function() {
      var args = [{component: 'MyComponent'}, '<div>'];

      Cosmos.start.apply(Cosmos, args);

      expect(Cosmos.Router.calls.mostRecent().args[0]).toBe(args[0]);
      expect(Cosmos.Router.calls.mostRecent().args[1]).toBe(args[1]);
    });

    it("should return the Router instance", function() {
      var router = Cosmos.start();

      expect(router).toBe(routerInstance);
    });
  });
});
