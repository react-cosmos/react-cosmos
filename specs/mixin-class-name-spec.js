var Fresh = require('../build/fresh.js'),
    React = require('react'),
    _ = require('underscore');

describe("Components implementing the ClassName mixin", function() {

  var ClassNameSpec = {
    mixins: [Fresh.mixins.ClassName],
    render: function() {
      return React.DOM.span(null, 'nada');
    }
  };

  it("should not return a class name when none is specified", function() {
    var ClassNameComponent = React.createClass(ClassNameSpec),
        componentInstance = ClassNameComponent();
    // React Components need to be rendered to mount
    React.renderComponentToString(componentInstance);
    expect(componentInstance.getClassName()).toEqual(null);
  });

  it("should return a class name when 'class' prop is set", function() {
    var ClassNameComponent = React.createClass(ClassNameSpec),
        componentInstance = ClassNameComponent({class: 'my-class'});
    // React Components need to be rendered to mount
    React.renderComponentToString(componentInstance);
    expect(componentInstance.getClassName()).toEqual('my-class');
  });

  it("should return default class name when defined", function() {
    var DefaultClassSpec = _.extend({defaultClass: 'default-class'}, ClassNameSpec),
        ClassNameComponent = React.createClass(DefaultClassSpec),
        componentInstance = ClassNameComponent();
    // React Components need to be rendered to mount
    React.renderComponentToString(componentInstance);
    expect(componentInstance.getClassName()).toEqual('default-class');
  });

  it("should return both default class and 'class' prop", function() {
    var DefaultClassSpec = _.extend({defaultClass: 'default-class'}, ClassNameSpec),
        ClassNameComponent = React.createClass(DefaultClassSpec),
        componentInstance = ClassNameComponent({class: 'my-class'});
    // React Components need to be rendered to mount
    React.renderComponentToString(componentInstance);
    expect(componentInstance.getClassName()).toEqual('default-class my-class');
  });
});
