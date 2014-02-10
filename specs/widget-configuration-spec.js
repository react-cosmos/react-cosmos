var Fresh = require('../fresh-bundle.js'),
    React = require('react-tools').React,
    _ = require('underscore');

describe("Widget configuration", function() {

  it("should draw its widgets from the fresh.widgets namespace", function() {
    var EmptyWidget = {};
    Fresh.widgets.EmptyWidget = EmptyWidget;
    expect(Fresh.getWidgetByName('EmptyWidget')).toBe(EmptyWidget);
  });

  describe("for the root-level widget", function() {

    it("should render correct widget using Fresh.start", function() {
      var FakeWidgetInstance = {};
      Fresh.widgets.FakeWidget = jasmine.createSpy('FakeWidget')
                                        .andReturn(FakeWidgetInstance);
      // No need to interact with React at this point
      spyOn(React, 'renderComponent');
      Fresh.start({widget: 'FakeWidget'});
      expect(React.renderComponent.mostRecentCall.args[0]).toBe(FakeWidgetInstance);
    });

    it("should create widget with correct props using Fresh.start", function() {
      Fresh.widgets.FakeWidget = jasmine.createSpy('FakeWidget');
      spyOn(React, 'renderComponent');
      Fresh.start({
        widget: 'FakeWidget',
        foo: 'bar'
      });
      expect(Fresh.widgets.FakeWidget.mostRecentCall.args[0]).toEqual({
        widget: 'FakeWidget',
        foo: 'bar'
      });
    });

    it("should not alter props object sent to Fresh.start", function() {
      var initialProps = {widget: 'TestWidget', foo: 'bar'},
                         initialPropsClone = _.clone(initialProps);
      Fresh.widgets.TestWidget = React.createClass({render: function(){}});
      spyOn(React, 'renderComponent');
      Fresh.start(initialProps, '<asdf>');
      expect(initialProps).toEqual(initialPropsClone);
      expect(React.renderComponent.mostRecentCall.args[0].props)
        .not.toBe(initialProps);
    });
  });
});
