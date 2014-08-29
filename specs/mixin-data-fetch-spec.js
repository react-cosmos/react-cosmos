describe("Components implementing the DataFetch mixin", function() {

  var _ = require('lodash'),
      jsdom = require('jsdom');

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

    React = require('react/addons');
    utils = React.addons.TestUtils;
    Cosmos = require('../build/cosmos.js');

    // The fetching method should do nothing, we only care that it is called
    // before the components gets mounted
    spyOn(Cosmos.mixins.DataFetch, 'fetchDataFromServer');
  });

  // In order to avoid any sort of state between tests, even the component class
  // generated for every test case
  var generateComponentClass = function(attributes) {
    return React.createClass(_.extend({}, {
      mixins: [Cosmos.mixins.DataFetch],
      render: function() {
        return React.DOM.span();
      }
    }, attributes));
  };

  var ComponentClass,
      componentInstance;

  it("should override initial data with non-empty value", function() {
    ComponentClass = generateComponentClass({initialData: {
      name: 'Guest'
    }});
    componentInstance = utils.renderIntoDocument(ComponentClass());
    expect(componentInstance.state.data).toEqual({name: 'Guest'});
  });

  it("should fetch data if a 'dataUrl' prop is set", function() {
    ComponentClass = generateComponentClass();
    componentInstance = utils.renderIntoDocument(ComponentClass({
      dataUrl: 'url?query=string'
    }));
    expect(Cosmos.mixins.DataFetch.fetchDataFromServer.calls.count()).toEqual(1);
  });

  it("shouldn't fetch data if a 'dataUrl' prop isn't set", function() {
    ComponentClass = generateComponentClass();
    componentInstance = utils.renderIntoDocument(ComponentClass());
    expect(Cosmos.mixins.DataFetch.fetchDataFromServer.calls.count()).toEqual(0);
  });

  it("should fetch data with `dataUrl` prop if set", function() {
    ComponentClass = generateComponentClass();
    componentInstance = utils.renderIntoDocument(ComponentClass({
      dataUrl: 'http://happiness.com'
    }));
    expect(Cosmos.mixins.DataFetch.fetchDataFromServer.calls.mostRecent().args[0])
          .toEqual('http://happiness.com');
  });

  it("should fetch data with `getDataUrl` method if set", function() {
    ComponentClass = generateComponentClass({
      getDataUrl: function() {
        return 'http://euphoria.org';
      }
    });
    componentInstance = utils.renderIntoDocument(ComponentClass());
    expect(Cosmos.mixins.DataFetch.fetchDataFromServer.calls.mostRecent().args[0])
          .toEqual('http://euphoria.org');
  });

  it("should choose `getDataUrl` method over `dataUrl` prop if both set", function() {
    ComponentClass = generateComponentClass({
      getDataUrl: function() {
        return 'http://euphoria.org';
      }
    });
    componentInstance = utils.renderIntoDocument(ComponentClass({
      dataUrl: 'http://happiness.com'
    }));
    expect(Cosmos.mixins.DataFetch.fetchDataFromServer.calls.mostRecent().args[0])
          .toEqual('http://euphoria.org');
  });

  it("should use props in `getDataUrl` method", function() {
    ComponentClass = generateComponentClass({
      getDataUrl: function(props) {
        return 'http://desertedblog.com?id=' + props.id;
      }
    });
    componentInstance = utils.renderIntoDocument(ComponentClass({id: 3}));
    expect(Cosmos.mixins.DataFetch.fetchDataFromServer.calls.mostRecent().args[0])
          .toEqual('http://desertedblog.com?id=3');
  });

  it("should populate state.data with fetched data", function() {
    ComponentClass = generateComponentClass();
    componentInstance = utils.renderIntoDocument(ComponentClass());
    componentInstance.receiveDataFromServer({name: 'John Doe', age: 42});
    expect(componentInstance.state.data).toEqual({name: 'John Doe', age: 42});
  });

  it("should replace initial data after data is fetched", function() {
    ComponentClass = generateComponentClass({
      initialData: {
        guest: true, name: 'Guest'
      }
    });
    componentInstance = utils.renderIntoDocument(ComponentClass());
    expect(componentInstance.state.data).toEqual({name: 'Guest', guest: true});
    componentInstance.receiveDataFromServer({name: 'John Doe', age: 42});
    expect(componentInstance.state.data).toEqual({name: 'John Doe', age: 42});
  });
});
