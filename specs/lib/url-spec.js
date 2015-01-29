describe("Cosmos.url", function() {

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
    Cosmos = require('../../build/cosmos.js');

    // The Cosmos.serialize lib is already tested in isolation
    spyOn(Cosmos.serialize, 'getPropsFromQueryString').and.returnValue({
      component: 'List',
      data: 'users.json'
    });
  });

  it(".getParams should extract the query string from the URL", function() {
    var props = Cosmos.url.getParams();

    expect(Cosmos.serialize.getPropsFromQueryString)
          .toHaveBeenCalledWith('component=List&data=users.json');

    expect(props).toEqual({
      component: 'List',
      data: 'users.json'
    });
  });
});
