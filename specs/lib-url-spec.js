var Fresh = require('../build/fresh.js');

describe("Fresh.url", function() {

  beforeEach(function() {
    global.window = {location: {search: '?component=List&data=users.json'}};
  });
  afterEach(function() {
    delete global.window;
  });

  it(".getParams extracts the query string from the URL", function() {
    expect(Fresh.url.getParams()).toEqual({
      component: 'List',
      data: 'users.json'
    });
  });

});
