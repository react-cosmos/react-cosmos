describe("Cosmos.serialize", function() {

  var jsdom = require('jsdom');

  // jsdom creates a fresh new window object for every test case and React needs
  // to be required *after* the window and document globals are available. The
  // var references however must be declared globally in order to be accessible
  // in test cases as well.
  var React,
      utils,
      Cosmos,
      queryString,
      props;

  beforeEach(function() {
    global.window = jsdom.jsdom().createWindow('<html><body></body></html>');
    global.document = global.window.document;
    global.navigator = global.window.navigator;

    React = require('react/addons');
    utils = React.addons.TestUtils;
    Cosmos = require('../../build/cosmos.js');
  });

  it("should generate props object from query string", function() {
    queryString = 'component=List&dataUrl=users.json';
    props = Cosmos.serialize.getPropsFromQueryString(queryString);

    expect(props).toEqual({
      component: 'List',
      dataUrl: 'users.json'
    });
  });

  it("should decode encoded params from query string", function() {
    queryString = 'component=List&prop=word%20with%20spaces';
    props = Cosmos.serialize.getPropsFromQueryString(queryString);

    expect(props).toEqual({
      component: 'List',
      prop: 'word with spaces'
    });
  });

  it("should parse stringified JSON from query string", function() {
    queryString = 'component=List&prop=' +
                  '%7B%22iam%22%3A%7B%22nested%22%3Atrue%7D%7D';
    props = Cosmos.serialize.getPropsFromQueryString(queryString);

    expect(props).toEqual({
      component: 'List',
      prop: {
        iam: {
          nested: true
        }
      }
    });
  });

  it("should generate query string from props", function() {
    props = {
      component: 'List',
      dataUrl: 'users.json'
    };
    queryString = Cosmos.serialize.getQueryStringFromProps(props);

    expect(queryString).toEqual('component=List&dataUrl=users.json');
  });

  it("should encode params in query string", function() {
    props = {
      component: 'List',
      prop: 'word with spaces'
    };
    queryString = Cosmos.serialize.getQueryStringFromProps(props);

    expect(queryString).toEqual('component=List&prop=word%20with%20spaces');
  });

  it("should stringify JSON in query string", function() {
    props = {
      component: 'List',
      prop: {
        iam: {
          nested: true
        }
      }
    };
    queryString = Cosmos.serialize.getQueryStringFromProps(props);

    expect(queryString).toEqual('component=List&prop=' +
                                '%7B%22iam%22%3A%7B%22nested%22%3Atrue%7D%7D');
  });
});
