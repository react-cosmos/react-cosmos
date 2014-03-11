var Fresh = require('../build/fresh.js');

describe("Fresh.Router", function() {

  beforeEach(function() {
    // Uses window event binding
    spyOn(Fresh.Router.prototype, '_bindPopStateEvent');
    // Use window.history
    spyOn(Fresh.Router.prototype, '_replaceHistoryState');
    spyOn(Fresh.Router.prototype, '_pushHistoryState');
    // Uses window.location
    spyOn(Fresh.Router.prototype, '_replaceInitialState');
    // Methods using jQuery
    spyOn(Fresh.Router.prototype, '_resetContainer');
    spyOn(Fresh.Router.prototype, '_getPreviousContainer');
    spyOn(Fresh.Router.prototype, '_createComponentContainer');
    // TODO: Mock narrower methods
    spyOn(Fresh.Router.prototype, '_transitionComponentContainers');
    // Out of Router scope
    spyOn(Fresh, 'render');
    spyOn(Fresh.url, 'isPushStateSupported').andReturn(true);
  });

  it("should save a reference to the DOM container", function() {
    var router = new Fresh.Router({container: '<body>'});
    expect(router.container).toEqual('<body>');
  });

  it("should create a new RouterHistory instance", function() {
    var router = new Fresh.Router({});
    expect(router.history).toEqual(jasmine.any(Fresh.RouterHistory));
  });

  describe("rendering new Components", function() {

    it("should use constructor props and container", function() {
      var router = new Fresh.Router({
            props: {component: 'List', dataUrl: 'users.json'},
            container: '<body>'
          });
      expect(Fresh.render.callCount).toEqual(1);
      expect(Fresh.render.mostRecentCall.args[0]).toEqual({
        component: 'List', dataUrl: 'users.json'
      });
    });

    it("should use props extracted from query string on .goTo", function() {
      var router = new Fresh.Router({});
      router.goTo('?component=List&dataUrl=users.json');
      expect(Fresh.render.callCount).toEqual(2);
      expect(Fresh.render.mostRecentCall.args[0]).toEqual({
        component: 'List',
        dataUrl: 'users.json'
      });
    });

    it("should use props from event state on PopState event", function() {
      var router = new Fresh.Router({});
      router._onPopState({
        state: {
          component: 'List',
          dataUrl: 'users.json'
        }
      });
      expect(Fresh.render.callCount).toEqual(2);
      expect(Fresh.render.mostRecentCall.args[0]).toEqual({
        component: 'List',
        dataUrl: 'users.json'
      });
    });
  });
});
