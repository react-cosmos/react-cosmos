describe("Components implementing the Url mixin", function() {

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
      mixins: [Cosmos.mixins.ComponentTree,
               Cosmos.mixins.Url],
      render: function() {
        return React.DOM.span();
      }
    }, attributes));
  };

  var ComponentClass,
      componentElement,
      componentInstance;

  it("should generate url with escaped props and state", function() {
    // The Cosmos.serialize lib is already tested in isolation
    spyOn(Cosmos.serialize, 'getQueryStringFromProps')
         .and.returnValue('players=5&state=%7B%22speed%22%3A1%7D');

    ComponentClass = generateComponentClass();
    componentElement = React.createElement(ComponentClass, {
      players: 5,
      state: {
        speed: 1
      }
    });
    componentInstance = utils.renderIntoDocument(componentElement);

    expect(componentInstance.getUrlFromProps(componentInstance.serialize()))
          // state=encodeURIComponent(JSON.stringify({speed:1}))
          .toEqual('?players=5&state=%7B%22speed%22%3A1%7D');

    expect(Cosmos.serialize.getQueryStringFromProps).toHaveBeenCalledWith({
      players: 5,
      state: {
        speed: 1
      }
    });
  });

  it("should call props instance from props", function() {
    var goToSpy = jasmine.createSpy();

    ComponentClass = generateComponentClass();
    componentElement = React.createElement(ComponentClass, {
      router: {
        goTo: goToSpy
      }
    });
    componentInstance = utils.renderIntoDocument(componentElement);

    // Fake the structure of an event
    componentInstance.routeLink({
      preventDefault: function() {},
      currentTarget: {
        href: 'my-page?component=NextComponent'
      }
    });

    expect(goToSpy).toHaveBeenCalledWith('my-page?component=NextComponent');
  });
});
