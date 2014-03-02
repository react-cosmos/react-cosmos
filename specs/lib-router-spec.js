var Fresh = require('../build/fresh.js');

describe("Fresh.Router", function() {

  beforeEach(function() {
    spyOn(Fresh.Router.prototype, '_bindPopStateEvent');
    spyOn(Fresh.Router.prototype, '_replaceInitialState');
    spyOn(Fresh.Router.prototype, '_pushState');
    spyOn(Fresh.url, 'isPushStateSupported').andReturn(true);
  });

  it("should save a reference to the DOM container", function() {
    // Ignore initial rendering in this test
    spyOn(Fresh.Router.prototype, 'render');
    var router = new Fresh.Router({container: '<body>'});
    expect(router.container).toEqual('<body>');
  });

  it("should create a new RouterHistory instance", function() {
    // Ignore initial rendering in this test
    spyOn(Fresh.Router.prototype, 'render');
    var router = new Fresh.Router({});
    expect(router.history).toEqual(jasmine.any(Fresh.RouterHistory));
  });

  describe("Router.render", function() {

    beforeEach(function() {
      spyOn(Fresh.Router.prototype, 'render');
    });

    it("should be called with constructor props and container", function() {
      var router = new Fresh.Router({
        props: {component: 'List', data: 'users.json'},
        container: '<body>'
      });
      expect(Fresh.Router.prototype.render.callCount).toEqual(1);
      expect(Fresh.Router.prototype.render.mostRecentCall.args[0]).toEqual({
        component: 'List', data: 'users.json'});
    });

    it("should be called with props extracted from query string on .goTo", function() {
      var router = new Fresh.Router({});
      router.goTo('?component=List&data=users.json');
      expect(Fresh.Router.prototype.render.callCount).toEqual(2);
      expect(Fresh.Router.prototype.render.mostRecentCall.args[0]).toEqual({
        component: 'List',
        data: 'users.json'
      });
    });

    it("should be called with with props from event state on PopState event", function() {
      var router = new Fresh.Router({});
      router._onPopState({
        state: {
          component: 'List',
          data: 'users.json'
        }
      });
      expect(Fresh.Router.prototype.render.callCount).toEqual(2);
      expect(Fresh.Router.prototype.render.mostRecentCall.args[0]).toEqual({
        component: 'List',
        data: 'users.json'
      });
    });
  });
});
