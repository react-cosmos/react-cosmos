var Fresh = require('../build/fresh.js');

describe("Fresh.Router", function() {

  beforeEach(function() {
    spyOn(Fresh.Router.prototype, '_bindPopStateEvent');
    spyOn(Fresh.Router.prototype, '_replaceInitialState');
  });

  it("should save a reference to the DOM container", function() {
    var router = new Fresh.Router({container: '<body>'});
    expect(router.container).toEqual('<body>');
  });

  describe(".toGo", function() {

    beforeEach(function() {
      spyOn(Fresh.Router.prototype, '_pushState');
      spyOn(Fresh.url, 'isPushStateSupported').andReturn(true);
    });

    it("should call Fresh.render with props extracted from query string", function() {
      spyOn(Fresh, 'render');
      var router = new Fresh.Router({});
      router.goTo('?component=List&data=users.json');
      expect(Fresh.render.callCount).toEqual(1);
      expect(Fresh.render.mostRecentCall.args[0]).toEqual({
        component: 'List',
        data: 'users.json'
      });
    });

    it("should call Fresh.render with original container", function() {
      spyOn(Fresh, 'render');
      var router = new Fresh.Router({container: '<body>'});
      router.goTo('');
      expect(Fresh.render.callCount).toEqual(1);
      expect(Fresh.render.mostRecentCall.args[1]).toEqual('<body>');
    });
  });
});
