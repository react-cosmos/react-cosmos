var Cosmos = require('../build/cosmos.js'),
    React = require('react'),
    _ = require('underscore');

describe("Cosmos", function() {

  it("should draw its components from the Cosmos.components namespace", function() {
    var EmptyComponent = {};
    Cosmos.components.EmptyComponent = EmptyComponent;
    expect(Cosmos.getComponentByName('EmptyComponent')).toBe(EmptyComponent);
  });

  it("should instantiate correct Component", function() {
    var fakeComponentInstance = {};
    Cosmos.components.FakeComponent = jasmine.createSpy('FakeComponent')
                                      .andReturn(fakeComponentInstance);
    expect(Cosmos({component: 'FakeComponent'})).toBe(fakeComponentInstance);
  });

  describe(".render", function() {

    it("should render to DOM if received a container", function() {
      Cosmos.components.FakeComponent = jasmine.createSpy('FakeComponent');
      spyOn(React, 'renderComponent');
      spyOn(React, 'renderComponentToString');
      Cosmos.render({component: 'FakeComponent'}, '<div>');
      expect(React.renderComponent.callCount).toBe(1);
      expect(React.renderComponentToString.callCount).toBe(0);
    });

    it("should render to string if didn't receive a container", function() {
      Cosmos.components.FakeComponent = jasmine.createSpy('FakeComponent');
      spyOn(React, 'renderComponent');
      spyOn(React, 'renderComponentToString');
      Cosmos.render({component: 'FakeComponent'});
      expect(React.renderComponent.callCount).toBe(0);
      expect(React.renderComponentToString.callCount).toBe(1);
    });

    it("should render correct Component", function() {
      var fakeComponentInstance = {};
      Cosmos.components.FakeComponent = jasmine.createSpy('FakeComponent')
                                        .andReturn(fakeComponentInstance);
      spyOn(React, 'renderComponentToString');
      Cosmos.render({component: 'FakeComponent'});
      expect(React.renderComponentToString.mostRecentCall.args[0])
            .toBe(fakeComponentInstance);
    });

    it("should create component with correct props", function() {
      Cosmos.components.FakeComponent = jasmine.createSpy('FakeComponent');
      spyOn(React, 'renderComponentToString');
      Cosmos.render({
        component: 'FakeComponent',
        foo: 'bar'
      });
      expect(Cosmos.components.FakeComponent.mostRecentCall.args[0]).toEqual({
        component: 'FakeComponent',
        foo: 'bar'
      });
    });

    it("should not alter props object received", function() {
      var initialProps = {component: 'TestComponent', foo: 'bar'},
                         initialPropsClone = _.clone(initialProps);
      Cosmos.components.TestComponent = React.createClass({render: function(){}});
      spyOn(React, 'renderComponentToString');
      Cosmos.render(initialProps);
      expect(initialProps).toEqual(initialPropsClone);
      expect(React.renderComponentToString.mostRecentCall.args[0].props)
        .not.toBe(initialProps);
    });
  });

  describe(".start", function() {

    beforeEach(function() {
      spyOn(Cosmos, 'Router');
      // Mock global objects in a browser
      global.window = {location: {search: '?component=List&data=users.json'}};
      global.document = {body: {}};
    });
    afterEach(function() {
      delete global.window;
      delete global.location;
    });

    it("should default to URL query string", function() {
      Cosmos.start();
      expect(Cosmos.Router.callCount).toBe(1);
      expect(Cosmos.Router.mostRecentCall.args[0].props).toEqual(
        Cosmos.url.getParams());
    });

    it("should use default props when props are empty", function() {
      spyOn(Cosmos.url, 'getParams').andReturn({});
      Cosmos.start({defaultProps: {
        component: 'DefaultComponent'
      }});
      expect(Cosmos.Router.mostRecentCall.args[0].props).toEqual({
        component: 'DefaultComponent'
      });
    });

    it("shouldn't use default props when props aren't empty", function() {
      Cosmos.start({defaultProps: {
        component: 'DefaultComponent'
      }});
      expect(Cosmos.Router.mostRecentCall.args[0].props).toEqual(
        Cosmos.url.getParams());
    });

    it("should default to document.body as container", function() {
      Cosmos.start();
      expect(Cosmos.Router.callCount).toBe(1);
      expect(Cosmos.Router.mostRecentCall.args[0].container).toBe(document.body);
    });

    it("should call Cosmos.Router with props and container", function() {
      Cosmos.start({
        props: {component: 'MissingComponent'},
        container: '<div>'
      });
      expect(Cosmos.Router.callCount).toBe(1);
      expect(Cosmos.Router.mostRecentCall.args[0].props).toEqual({
        component: 'MissingComponent'});
      expect(Cosmos.Router.mostRecentCall.args[0].container).toEqual('<div>');
    });

    it("should create a global Cosmos.Router instance", function() {
      Cosmos.start({});
      expect(Cosmos.Router.callCount).toBe(1);
      expect(Cosmos.router).toEqual(jasmine.any(Cosmos.Router));
    });
  });
});
