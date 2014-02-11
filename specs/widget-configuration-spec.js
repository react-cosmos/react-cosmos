var Fresh = require('../fresh-bundle.js'),
    React = require('react-tools').React,
    _ = require('underscore');

describe("Component configuration", function() {

  it("should draw its components from the fresh.components namespace", function() {
    var EmptyComponent = {};
    Fresh.components.EmptyComponent = EmptyComponent;
    expect(Fresh.getComponentByName('EmptyComponent')).toBe(EmptyComponent);
  });

  describe("for the root-level component", function() {

    it("should render correct component using Fresh.start", function() {
      var fakeComponentInstance = {};
      Fresh.components.FakeComponent = jasmine.createSpy('FakeComponent')
                                        .andReturn(fakeComponentInstance);
      // No need to interact with React at this point
      spyOn(React, 'renderComponent');
      Fresh.start({component: 'FakeComponent'});
      expect(React.renderComponent.mostRecentCall.args[0]).toBe(fakeComponentInstance);
    });

    it("should create component with correct props using Fresh.start", function() {
      Fresh.components.FakeComponent = jasmine.createSpy('FakeComponent');
      spyOn(React, 'renderComponent');
      Fresh.start({
        component: 'FakeComponent',
        foo: 'bar'
      });
      expect(Fresh.components.FakeComponent.mostRecentCall.args[0]).toEqual({
        component: 'FakeComponent',
        foo: 'bar'
      });
    });

    it("should not alter props object sent to Fresh.start", function() {
      var initialProps = {component: 'TestComponent', foo: 'bar'},
                         initialPropsClone = _.clone(initialProps);
      Fresh.components.TestComponent = React.createClass({render: function(){}});
      spyOn(React, 'renderComponent');
      Fresh.start(initialProps, '<asdf>');
      expect(initialProps).toEqual(initialPropsClone);
      expect(React.renderComponent.mostRecentCall.args[0].props)
        .not.toBe(initialProps);
    });
  });
});
