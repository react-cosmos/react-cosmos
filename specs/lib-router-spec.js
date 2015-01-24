describe("Cosmos.Router", function() {

  var jsdom = require('jsdom');

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
    // We're mocking the URL query string of the window
    global.window.location = {search: '?component=List&data=users.json'};

    React = require('react/addons');
    utils = React.addons.TestUtils;
    Cosmos = require('../build/cosmos.js');

    // Ignore out of scope methods
    spyOn(Cosmos.Router.prototype, '_bindPopStateEvent');
    spyOn(Cosmos.Router.prototype, '_replaceHistoryState');
    spyOn(Cosmos.Router.prototype, '_pushHistoryState');
    spyOn(Cosmos.url, 'isPushStateSupported').and.returnValue(true);
  });

  describe("new instance", function() {

      beforeEach(function() {
        spyOn(Cosmos, 'render');
      });

      it("should default to URL query string", function() {
        var router = new Cosmos.Router();

        expect(router.options.props).toEqual(Cosmos.url.getParams());
      });

      it("shouldn't use default props when props aren't empty", function() {
        var router = new Cosmos.Router({defaultProps: {
          component: 'DefaultComponent'
        }});

        expect(router.options.props).toEqual(Cosmos.url.getParams());
      });

      it("should default to document.body as container", function() {
        var router = new Cosmos.Router();

        expect(router.options.container).toBe(document.body);
      });

      it("should save a reference to the DOM container", function() {
        var container = React.DOM.span();
            router = new Cosmos.Router({container: '<span>'});

        expect(router.container).toEqual('<span>');
      });
  });

  describe("should render new Components", function() {

    beforeEach(function() {
      spyOn(Cosmos, 'render');
    });

    it("with constructor props and container", function() {
      var router = new Cosmos.Router({
        props: {component: 'List', dataUrl: 'users.json'},
        container: '<span>'
      });

      expect(Cosmos.render.calls.count()).toEqual(1);
      expect(Cosmos.render.calls.mostRecent().args[0]).toEqual({
        component: 'List', dataUrl: 'users.json'
      });
      expect(Cosmos.render.calls.mostRecent().args[1]).toEqual('<span>');
    });

    it("with props extracted from query string on .goTo", function() {
      var router = new Cosmos.Router({});
      router.goTo('?component=List&dataUrl=users.json');

      expect(Cosmos.render.calls.count()).toEqual(2);
      expect(Cosmos.render.calls.mostRecent().args[0]).toEqual({
        component: 'List',
        dataUrl: 'users.json'
      });
    });

    it("with props from event state on PopState event", function() {
      var router = new Cosmos.Router({});
      router._onPopState({
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
  });

  it("should cache latest snapshot of previous Component", function() {
    var ComponentClass = React.createClass({
          mixins: [Cosmos.mixins.PersistState],
          render: function() {
            return React.DOM.span();
          }
        }),
        props = {component: 'List', dataUrl: 'users.json'},
        componentElement = React.createElement(ComponentClass, props)
        componentInstance = utils.renderIntoDocument(componentElement);

    // We just want a valid instance to work with, the Router props won't be
    // taken into consideration
    spyOn(Cosmos, 'render').and.callFake(function(props) {
      return componentInstance;
    });

    var router = new Cosmos.Router();
    // We alter the current instance while it's bound to the current history
    // entry
    componentInstance.setProps({dataUrl: null, someNumber: 555});
    componentInstance.setState({amIState: true});

    // Before routing to a new Component configuration, the previous one
    // shouldn't been updated with our changes
    router.goTo('?component=User&dataUrl=user.json');
    
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
