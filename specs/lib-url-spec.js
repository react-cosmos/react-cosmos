var Cosmos = require('../build/cosmos.js');

describe("Cosmos.url", function() {

  beforeEach(function() {
    global.window = {location: {search: '?component=List&dataUrl=users.json'}};
  });
  afterEach(function() {
    delete global.window;
  });

  it(".getParams should extract the query string from the URL", function() {
    expect(Cosmos.url.getParams()).toEqual({
      component: 'List',
      dataUrl: 'users.json'
    });
  });
});
