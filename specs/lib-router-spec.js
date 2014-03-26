var Cosmos = require('../build/cosmos.js'),
    React = require('react');

describe("Cosmos.Router", function() {

  beforeEach(function() {
    // Mock global objects in a browser
    global.window = {location: {search: '?component=List&data=users.json'}};
    global.document = {body: {}};
    // Uses window event binding
    spyOn(Cosmos.Router.prototype, '_bindPopStateEvent');
    // Use window.history
    spyOn(Cosmos.Router.prototype, '_replaceHistoryState');
    spyOn(Cosmos.Router.prototype, '_pushHistoryState');
    // Uses window.location
    spyOn(Cosmos.Router.prototype, '_replaceInitialState');
    // Methods using jQuery
    spyOn(Cosmos.Router.prototype, '_resetContainer');
    spyOn(Cosmos.Router.prototype, '_createComponentContainer');
    spyOn(Cosmos.Router.prototype, '_transitionComponentContainer');
    // Out of Router scope
    spyOn(Cosmos.url, 'isPushStateSupported').andReturn(true);
  });

  afterEach(function() {
    delete global.window;
    delete global.location;
  });

  describe("new instance", function() {

      beforeEach(function() {
        spyOn(Cosmos, 'render');
      });

      it("should default to URL query string", function() {
        var router = new Cosmos.Router();
        expect(router.options.props).toEqual(Cosmos.url.getParams());
      });

      it("should use default props when props are empty", function() {
        spyOn(Cosmos.url, 'getParams').andReturn({});
        var router = new Cosmos.Router({defaultProps: {
          component: 'DefaultComponent'
        }});
        expect(router.options.props).toEqual({
          component: 'DefaultComponent'
        });
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
        var router = new Cosmos.Router({container: '<body>'});
        expect(router.container).toEqual('<body>');
      });

      it("should create a new RouterHistory instance", function() {
        var router = new Cosmos.Router();
        expect(router.history).toEqual(jasmine.any(Cosmos.RouterHistory));
      });
  });

  describe("should render new Components", function() {

    beforeEach(function() {
      spyOn(Cosmos, 'render');
    });

    it("with constructor props and container", function() {
      var router = new Cosmos.Router({
            props: {component: 'List', dataUrl: 'users.json'},
            container: '<body>'
          });
      expect(Cosmos.render.callCount).toEqual(1);
      expect(Cosmos.render.mostRecentCall.args[0]).toEqual({
        component: 'List', dataUrl: 'users.json'
      });
    });

    it("with props extracted from query string on .goTo", function() {
      var router = new Cosmos.Router({});
      router.goTo('?component=List&dataUrl=users.json');
      expect(Cosmos.render.callCount).toEqual(2);
      expect(Cosmos.render.mostRecentCall.args[0]).toEqual({
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
      expect(Cosmos.render.callCount).toEqual(2);
      expect(Cosmos.render.mostRecentCall.args[0]).toEqual({
        component: 'List',
        dataUrl: 'users.json'
      });
    });
  });

  describe("on PopState events", function() {

    beforeEach(function() {
      spyOn(Cosmos, 'render');
    });

    it("should reset history if not in current history", function() {
      var router = new Cosmos.Router({
        props: {
          component: 'List',
          dataUrl: 'users.json'
        }
      });
      router._onPopState({
        state: {
          component: 'User',
          dataUrl: 'user.json'
        }
      });
      expect(router.history.length).toBe(1);
      expect(router.history[router.history.index].props).toEqual({
        component: 'User',
        dataUrl: 'user.json'
      });
    });

    it("should reset history if not direct neighbor of current history entry", function() {
      var router = new Cosmos.Router({
        props: {
          component: 'List',
          dataUrl: 'users.json'
        }
      });
      router.goTo('?component=User&dataUrl=user.json');
      router.goTo('?component=Picture&dataUrl=picture.jpg');
      router._onPopState({
        state: {
          component: 'List',
          dataUrl: 'users.json'
        }
      });
      expect(router.history.length).toBe(1);
      expect(router.history[router.history.index].props).toEqual({
        component: 'List',
        dataUrl: 'users.json'
      });
    });

    it("should not alter history if same as current history entry", function() {
      var router = new Cosmos.Router({
        props: {
          component: 'List',
          dataUrl: 'users.json'
        }
      });
      router._onPopState({
        state: {
          component: 'List',
          dataUrl: 'users.json'
        }
      });
      expect(router.history.length).toBe(1);
    });

    it("should continue history if left of current history entry", function() {
      var router = new Cosmos.Router({
        props: {
          component: 'List',
          dataUrl: 'users.json'
        }
      });
      router.goTo('?component=User&dataUrl=user.json');
      router._onPopState({
        state: {
          component: 'List',
          dataUrl: 'users.json'
        }
      });
      expect(router.history.length).toBe(2);
      expect(router.history.index).toBe(0);
    });

    it("should continue history if right of current history entry", function() {
      var router = new Cosmos.Router({
        props: {
          component: 'List',
          dataUrl: 'users.json'
        }
      });
      router.goTo('?component=User&dataUrl=user.json');
      // Move router history to first entry
      router.history.index = 0;
      router._onPopState({
        state: {
          component: 'User',
          dataUrl: 'user.json'
        }
      });
      expect(router.history.length).toBe(2);
      expect(router.history.index).toBe(1);
    });
  });

  it("should cache latest snapshot of previous Component", function() {
    var ComponentSpec = {
          mixins: [Cosmos.mixins.PersistState],
          render: function() {
            return React.DOM.span(null, 'nada');
          }
        },
        ComponentClass = React.createClass(ComponentSpec),
        props = {component: 'List', dataUrl: 'users.json'},
        componentInstance = ComponentClass(props);
    // React Components need to be rendered to mount
    React.renderComponentToString(componentInstance);
    spyOn(Cosmos, 'render').andCallFake(function(props) {
      return componentInstance;
    });
    var router = new Cosmos.Router({props: props});
    // We alter the current instance while it's bound to the current history
    // entry
    componentInstance.setProps({dataUrl: null, someNumber: 555});
    componentInstance.setState({amIState: true});
    // Before routing to a new Component configuration, the previous one
    // shouldn't been update with our changes
    router.goTo('?component=User&dataUrl=user.json');
    expect(router.history[0].props).toEqual({
      component: 'List',
      dataUrl: null,
      someNumber: 555,
      state: {
        amIState: true
      }
    });
  });
});
