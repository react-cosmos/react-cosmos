describe("Cosmos", function() {

  var _ = require('underscore'),
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

  it("should draw its components from the Cosmos.components namespace", function() {
    var FakeComponent = {};
    Cosmos.components.FakeComponent = FakeComponent;
    expect(Cosmos.getComponentByName('FakeComponent')).toBe(FakeComponent);
  });

  it("should instantiate correct Component", function() {
    var fakeComponentInstance = {};
    Cosmos.components.FakeComponent = jasmine.createSpy('FakeComponent')
                                      .and.returnValue(fakeComponentInstance);
    expect(Cosmos({component: 'FakeComponent'})).toBe(fakeComponentInstance);
  });

  describe(".render", function() {

    it("should render to DOM if received a container", function() {
      Cosmos.components.FakeComponent = jasmine.createSpy('FakeComponent');
      spyOn(React, 'renderComponent');
      spyOn(React, 'renderComponentToString');
      Cosmos.render({component: 'FakeComponent'}, '<div>');
      expect(React.renderComponent.calls.count()).toBe(1);
      expect(React.renderComponentToString.calls.count()).toBe(0);
    });

    it("should render to string if didn't receive a container", function() {
      Cosmos.components.FakeComponent = jasmine.createSpy('FakeComponent');
      spyOn(React, 'renderComponent');
      spyOn(React, 'renderComponentToString');
      Cosmos.render({component: 'FakeComponent'});
      expect(React.renderComponent.calls.count()).toBe(0);
      expect(React.renderComponentToString.calls.count()).toBe(1);
    });

    it("should render correct Component", function() {
      var fakeComponentInstance = {};
      Cosmos.components.FakeComponent = jasmine.createSpy('FakeComponent')
                                        .and.returnValue(fakeComponentInstance);
      spyOn(React, 'renderComponentToString');
      Cosmos.render({component: 'FakeComponent'});
      expect(React.renderComponentToString.calls.mostRecent().args[0])
            .toBe(fakeComponentInstance);
    });

    it("should create component with correct props", function() {
      Cosmos.components.FakeComponent = jasmine.createSpy('FakeComponent');
      spyOn(React, 'renderComponentToString');
      Cosmos.render({
        component: 'FakeComponent',
        foo: 'bar'
      });
      expect(Cosmos.components.FakeComponent.calls.mostRecent().args[0]).toEqual({
        component: 'FakeComponent',
        foo: 'bar'
      });
    });

    it("should not alter props object received", function() {
      var initialProps = {component: 'EmptyComponent', foo: 'bar'},
          initialPropsClone = _.clone(initialProps);
      Cosmos.components.EmptyComponent = React.createClass({render: function(){}});
      spyOn(React, 'renderComponentToString');
      Cosmos.render(initialProps);
      expect(initialProps).toEqual(initialPropsClone);
      expect(React.renderComponentToString.calls.mostRecent().args[0].props)
            .not.toBe(initialProps);
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
