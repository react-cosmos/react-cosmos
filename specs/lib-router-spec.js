var Fresh = require('../build/fresh.js');

describe("Fresh.Router", function() {

  beforeEach(function() {
    spyOn(Fresh, 'render');
    spyOn(Fresh.Router.prototype, '_bindPopStateEvent');
    spyOn(Fresh.Router.prototype, '_replaceInitialState');
  });

  it("should save a reference to the DOM container", function() {
    var router = new Fresh.Router({container: '<body>'});
    expect(router.container).toEqual('<body>');
  });

  it("should call Fresh.render with constructor props and container", function() {
    var router = new Fresh.Router({
      props: {component: 'List', data: 'users.json'},
      container: '<body>'
    });
    expect(Fresh.render.callCount).toEqual(1);
    expect(Fresh.render.mostRecentCall.args[0]).toEqual({
      component: 'List', data: 'users.json'});
    expect(Fresh.render.mostRecentCall.args[1]).toEqual('<body>');
  });

  describe(".goTo", function() {

    beforeEach(function() {
      spyOn(Fresh.Router.prototype, '_pushState');
      spyOn(Fresh.url, 'isPushStateSupported').andReturn(true);
    });

    it("should call Fresh.render with props extracted from query string", function() {
      var router = new Fresh.Router({});
      router.goTo('?component=List&data=users.json');
      expect(Fresh.render.callCount).toEqual(2);
      expect(Fresh.render.mostRecentCall.args[0]).toEqual({
        component: 'List',
        data: 'users.json'
      });
    });

    it("should call Fresh.render with original container", function() {
      var router = new Fresh.Router({container: '<body>'});
      router.goTo('');
      expect(Fresh.render.callCount).toEqual(2);
      expect(Fresh.render.mostRecentCall.args[1]).toEqual('<body>');
    });
  });

  describe("on PopState event", function() {

    it("should call Fresh.render with props from event state", function() {
      var router = new Fresh.Router({});
      router._onPopState({
        state: {
          component: 'List',
          data: 'users.json'
        }
      });
      expect(Fresh.render.callCount).toEqual(2);
      expect(Fresh.render.mostRecentCall.args[0]).toEqual({
        component: 'List',
        data: 'users.json'
      });
    });

    it("should call Fresh.render with original container", function() {
      var router = new Fresh.Router({container: '<body>'});
      router._onPopState({state: {}});
      expect(Fresh.render.callCount).toEqual(2);
      expect(Fresh.render.mostRecentCall.args[1]).toEqual('<body>');
    });
  });
});
