var Fresh = require('../build/fresh.js'),
    React = require('react'),
    _ = require('underscore');

describe("Component configuration", function() {

  it("should draw its components from the Fresh.components namespace", function() {
    var EmptyComponent = {};
    Fresh.components.EmptyComponent = EmptyComponent;
    expect(Fresh.getComponentByName('EmptyComponent')).toBe(EmptyComponent);
  });

  describe("Fresh.render", function() {

    it("should render to DOM if received a container", function() {
      Fresh.components.FakeComponent = jasmine.createSpy('FakeComponent');
      spyOn(React, 'renderComponent');
      spyOn(React, 'renderComponentToString');
      Fresh.render({component: 'FakeComponent'}, '<div>');
      expect(React.renderComponent.callCount).toBe(1);
      expect(React.renderComponentToString.callCount).toBe(0);
    });

    it("should render to string if didn't receive a container", function() {
      Fresh.components.FakeComponent = jasmine.createSpy('FakeComponent');
      spyOn(React, 'renderComponent');
      spyOn(React, 'renderComponentToString');
      Fresh.render({component: 'FakeComponent'});
      expect(React.renderComponent.callCount).toBe(0);
      expect(React.renderComponentToString.callCount).toBe(1);
    });

    it("should render correct Component", function() {
      var fakeComponentInstance = {};
      Fresh.components.FakeComponent = jasmine.createSpy('FakeComponent')
                                        .andReturn(fakeComponentInstance);
      spyOn(React, 'renderComponentToString');
      Fresh.render({component: 'FakeComponent'});
      expect(React.renderComponentToString.mostRecentCall.args[0])
            .toBe(fakeComponentInstance);
    });

    it("should create component with correct props", function() {
      Fresh.components.FakeComponent = jasmine.createSpy('FakeComponent');
      spyOn(React, 'renderComponentToString');
      Fresh.render({
        component: 'FakeComponent',
        foo: 'bar'
      });
      expect(Fresh.components.FakeComponent.mostRecentCall.args[0]).toEqual({
        component: 'FakeComponent',
        foo: 'bar'
      });
    });

    it("should not alter props object received", function() {
      var initialProps = {component: 'TestComponent', foo: 'bar'},
                         initialPropsClone = _.clone(initialProps);
      Fresh.components.TestComponent = React.createClass({render: function(){}});
      spyOn(React, 'renderComponentToString');
      Fresh.render(initialProps);
      expect(initialProps).toEqual(initialPropsClone);
      expect(React.renderComponentToString.mostRecentCall.args[0].props)
        .not.toBe(initialProps);
    });
  });
});
