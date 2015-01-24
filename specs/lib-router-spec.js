describe("Cosmos.Router", function() {

  var jsdom = require('jsdom');

  // jsdom creates a fresh new window object for every test case and React needs
  // to be required *after* the window and document globals are available. The
  // var references however must be declared globally in order to be accessible
  // in test cases as well.
  var React,
      utils,
      Cosmos,
      propsFromQueryString,
      ComponentClass,
      componentElement,
      componentInstance,
      componentCallback;

  beforeEach(function() {
    global.window = jsdom.jsdom().createWindow('<html><body></body></html>');
    global.document = global.window.document;
    global.navigator = global.window.navigator;

    React = require('react/addons');
    utils = React.addons.TestUtils;
    Cosmos = require('../build/cosmos.js');

    // Ignore native APIs
    spyOn(Cosmos.Router.prototype, '_bindPopStateEvent');
    spyOn(Cosmos.Router.prototype, '_replaceHistoryState');
    spyOn(Cosmos.Router.prototype, '_pushHistoryState');

    // The Cosmos.url lib is already tested in isolation
    propsFromQueryString = {
      component: 'List',
      data: 'users.json'
    };
    spyOn(Cosmos.url, 'getParams').and.returnValue(propsFromQueryString);
    spyOn(Cosmos.url, 'isPushStateSupported').and.returnValue(true);

    // We just want a valid instance to work with, the Router props won't be
    // taken into consideration
    spyOn(Cosmos, 'render').and.callFake(function(props, container, callback) {
      componentCallback = callback;
      return componentInstance;
    });

    // Clean up previous component setups
    ComponentClass = null;
    componentElement = null;
    componentInstance = null;
  });

  it("should use props from URL query string", function() {
    var router = new Cosmos.Router();

    expect(Cosmos.render.calls.mostRecent().args[0])
          .toEqual(propsFromQueryString);
  });

  it("should extend default props", function() {
    var router = new Cosmos.Router({
      component: 'DefaultComponent',
      defaultProp: true
    });

    expect(Cosmos.render.calls.mostRecent().args[0]).toEqual({
      component: 'List',
      data: 'users.json',
      // The props for the url didn't override this prop
      defaultProp: true
    });
  });

  it("should default to document.body as container", function() {
    var router = new Cosmos.Router();

    expect(Cosmos.render.calls.mostRecent().args[1]).toBe(document.body);
  });

  it("should use props from .goTo method", function() {
    var router = new Cosmos.Router();
    router.goTo('?component=List&dataUrl=users.json');

    expect(Cosmos.render.calls.count()).toEqual(2);
    expect(Cosmos.render.calls.mostRecent().args[0]).toEqual({
      component: 'List',
      dataUrl: 'users.json'
    });
  });

  it("should extend default props when using .goTo method", function() {
    var router = new Cosmos.Router({
      component: 'DefaultComponent',
      defaultProp: true
    });
    router.goTo('?component=List&dataUrl=users.json');

    expect(Cosmos.render.calls.count()).toEqual(2);
    expect(Cosmos.render.calls.mostRecent().args[0]).toEqual({
      component: 'List',
      dataUrl: 'users.json',
      // The props for the url didn't override this prop
      defaultProp: true
    });
  });

  it("should push component snapshot to state when using .goTo method",
     function() {
    ComponentClass = React.createClass({
      mixins: [Cosmos.mixins.PersistState],
      render: function() {
        return React.DOM.span();
      }
    });
    componentElement = React.createElement(ComponentClass, {
      component: 'List',
      dataUrl: 'users.json'
    });
    componentInstance = utils.renderIntoDocument(componentElement);

    // Simulate some state addition in the component
    spyOn(componentInstance, 'generateSnapshot').and.callFake(function() {
      return {
        component: 'List',
        dataUrl: 'users.json',
        state: {
          haveISeenThings: 'yes'
        }
      };
    });

    var router = new Cosmos.Router();
    router.goTo('?component=List&dataUrl=users.json');

    // Simulate React.render callback call
    componentCallback.call(componentInstance, 'testx');

    // The snapshot shouldn't been extracted from the component two times
    // 1. For previous component
    // 2. For just loaded component
    expect(componentInstance.generateSnapshot.calls.count()).toEqual(2);

    // It's a bit difficult to mock the native functions so we mocked the
    // private methods that wrap those calls
    expect(router._pushHistoryState.calls.count()).toEqual(1);
    expect(router._pushHistoryState.calls.mostRecent().args[0]).toEqual({
      component: 'List',
      dataUrl: 'users.json',
      state: {
        haveISeenThings: 'yes'
      }
    });
  });

  it("should use props from PopState event state", function() {
    var router = new Cosmos.Router();
    router.onPopState({
      state: {
        component: 'List',
        dataUrl: 'users.json'
      }
    });

    expect(Cosmos.render.calls.count()).toEqual(2);
    expect(Cosmos.render.calls.mostRecent().args[0]).toEqual({
      component: 'List',
      dataUrl: 'users.json'
    });
  });

  it("shouldn't extend default props when using PopState event", function() {
    var router = new Cosmos.Router({
      component: 'DefaultComponent',
      defaultProp: true
    });
    router.onPopState({
      state: {
        component: 'List',
        dataUrl: 'users.json'
      }
    });

    expect(Cosmos.render.calls.count()).toEqual(2);
    expect(Cosmos.render.calls.mostRecent().args[0]).toEqual({
      component: 'List',
      dataUrl: 'users.json'
    });
  });

  it("should cache latest snapshot of previous Component", function() {
    /* Note: This is not a pure unit test, it depends on the internal logic
       of React components */
    ComponentClass = React.createClass({
      mixins: [Cosmos.mixins.PersistState],
      render: function() {
        return React.DOM.span();
      }
    });
    componentElement = React.createElement(ComponentClass, {
      component: 'List',
      dataUrl: 'users.json'
    });
    componentInstance = utils.renderIntoDocument(componentElement);

    var router = new Cosmos.Router();
    // We alter the current instance while it's bound to the current history
    // entry
    componentInstance.setProps({dataUrl: null, someNumber: 555});
    componentInstance.setState({amIState: true});

    // Before routing to a new Component configuration, the previous one
    // shouldn't been updated with our changes
    router.goTo('?component=User&dataUrl=user.json');

    // It's a bit difficult to mock the native functions so we mocked the
    // private methods that wrap those calls
    expect(router._replaceHistoryState.calls.count()).toEqual(1);
    expect(router._replaceHistoryState.calls.mostRecent().args[0]).toEqual({
      component: 'List',
      dataUrl: null,
      someNumber: 555,
      state: {
        amIState: true
      }
    });
  });
});
