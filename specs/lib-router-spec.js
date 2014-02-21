var Fresh = require('../build/fresh.js');

describe("Fresh.Router", function() {

  it("should save a reference to the DOM container", function() {
    spyOn(Fresh.Router.prototype, '_bindPopStateEvent');
    spyOn(Fresh.Router.prototype, '_replaceInitialState');
    var router = new Fresh.Router({container: '<body>'});
    expect(router.container).toEqual('<body>');
  });
});
