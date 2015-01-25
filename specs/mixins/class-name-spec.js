describe("Components implementing the ClassName mixin", function() {

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
    Cosmos = require('../../build/cosmos.js');
  });

  // In order to avoid any sort of state between tests, even the component class
  // generated for every test case
  var generateComponentClass = function(attributes) {
    return React.createClass(_.extend({}, {
      mixins: [Cosmos.mixins.ClassName],
      render: function() {
        return React.DOM.span();
      }
    }, attributes));
  };

  var ComponentClass,
      componentElement,
      componentInstance;

  it("should not return a class name when none is received", function() {
    ComponentClass = generateComponentClass();
    componentElement = React.createElement(ComponentClass)
    componentInstance = utils.renderIntoDocument(componentElement);

    expect(componentInstance.getClassName()).toBe(undefined);
  });

  it("should return a class name when class prop is passed", function() {
    ComponentClass = generateComponentClass();
    componentElement = React.createElement(ComponentClass, {
      className: 'my-class'
    });
    componentInstance = utils.renderIntoDocument(componentElement);

    expect(componentInstance.getClassName()).toEqual('my-class');
  });

  it("should return default class name when passed", function() {
    ComponentClass = generateComponentClass();
    componentElement = React.createElement(ComponentClass)
    componentInstance = utils.renderIntoDocument(componentElement);

    expect(componentInstance.getClassName('default-class'))
          .toEqual('default-class');
  });

  it("should override default class with class from props", function() {
    ComponentClass = generateComponentClass();
    componentElement = React.createElement(ComponentClass, {
      className: 'my-class'
    });
    componentInstance = utils.renderIntoDocument(componentElement);

    expect(componentInstance.getClassName('default-class'))
          .toEqual('my-class');
  });
});
