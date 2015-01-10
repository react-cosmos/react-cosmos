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
        return;
      }
    });
  });

  it("should draw its components from the Cosmos.components namespace", function() {
    Cosmos.components.Dummy = DummyComponentClass;
    expect(Cosmos.getComponentByName('Dummy')).toBe(DummyComponentClass);
  });

  it("should draw its components from lookup callback", function() {
    var componentLookup = function(name) {
      expect(name).toBe('Dummy');
      return DummyComponentClass;
    };
    expect(Cosmos.getComponentByName('Dummy', componentLookup))
          .toBe(DummyComponentClass);
  });

  it("should create React element for component class", function() {
    spyOn(React, 'createElement')
         .and.returnValue(function(){});

    Cosmos.createElement({
      component: 'Dummy',
      componentLookup: function(name) {
        expect(name).toBe('Dummy');
        return DummyComponentClass;
      }
    });

    expect(React.createElement.calls.count()).toBe(1);
    expect(React.createElement.calls.mostRecent().args[0])
          .toBe(DummyComponentClass);
  });

  it("should create component element with cloned props", function() {
    spyOn(React, 'createElement')
          .and.returnValue(function(){});

    var props = {
      component: 'Dummy',
      componentLookup: function(name) {
        return DummyComponentClass;
      }
    };
    Cosmos.createElement(props);

    expect(React.createElement.calls.count()).toBe(1);
    expect(React.createElement.calls.mostRecent().args[1])
          .toEqual(props);
    expect(React.createElement.calls.mostRecent().args[1])
          .not.toBe(props);
  });

  describe(".render", function() {

    it("should render to DOM if received a container", function() {
      Cosmos.components.Dummy = DummyComponentClass;

      spyOn(React, 'render');
      spyOn(React, 'renderToString');

      Cosmos.render({component: 'Dummy'}, '<div>');

      expect(React.render.calls.count()).toBe(1);
      expect(React.renderToString.calls.count()).toBe(0);
    });

    it("should render to string if didn't receive a container", function() {
      Cosmos.components.Dummy = DummyComponentClass;

      spyOn(React, 'render');
      spyOn(React, 'renderToString');

      Cosmos.render({component: 'Dummy'});

      expect(React.render.calls.count()).toBe(0);
      expect(React.renderToString.calls.count()).toBe(1);
    });

    it("should create element with the same props", function() {
      spyOn(Cosmos, 'createElement');
      spyOn(React, 'renderToString');

      var props = {
        component: 'FakeComponent',
        foo: 'bar'
      };
      Cosmos.render(props);

      expect(Cosmos.createElement.calls.count()).toBe(1);
      expect(Cosmos.createElement.calls.mostRecent().args[0]).toBe(props);
    });
  });

  describe(".start", function() {

    beforeEach(function() {
      spyOn(Cosmos, 'Router');
    });

    it("should call Cosmos.Router", function() {
      Cosmos.start();
      expect(Cosmos.Router.calls.count()).toBe(1);
    });

    it("should create Cosmos.Router instance with same options", function() {
      Cosmos.start({
        props: {component: 'MissingComponent'},
        container: '<div>'
      });

      expect(Cosmos.Router.calls.mostRecent().args[0]).toEqual({
        props: {component: 'MissingComponent'},
        container: '<div>'
      });
    });

    it("should return a Cosmos.Router instance", function() {
      var router = Cosmos.start();
      expect(router).toEqual(jasmine.any(Cosmos.Router));
    });
  });
});
