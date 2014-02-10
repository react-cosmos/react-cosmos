var Fresh = require('../fresh-bundle.js'),
    React = require('react-tools').React,
    $ = require('jquery');

describe("Widgets implementing the DataManager mixin", function() {

  var DataManagerSpec = {
    mixins: [Fresh.mixins.DataManager],
    render: function() {
      return React.DOM.span(null, 'nada');
    }
  };

  it("should fetch data if a 'data' prop is set", function() {
    // The fetching method should do nothing, we only care that it is called
    // before the widget gets mounted
    spyOn(Fresh.mixins.DataManager, 'fetchDataFromServer');
    var DataManagerWidget = React.createClass(DataManagerSpec),
        widgetInstance = DataManagerWidget({data: 'url?query=string'});

    // React Components need to be rendered to mount
    React.renderComponentToString(widgetInstance, function() {});
    expect(Fresh.mixins.DataManager
           .fetchDataFromServer.callCount).toEqual(1);
  });

  it("shouldn't fetch data if a 'data' prop isn't set", function() {
    // The fetching method should do nothing, we only care that it is called
    // before the widget gets mounted
    spyOn(Fresh.mixins.DataManager, 'fetchDataFromServer');
    var DataManagerWidget = React.createClass(DataManagerSpec),
        widgetInstance = DataManagerWidget({});

    // React Components need to be rendered to mount
    React.renderComponentToString(widgetInstance, function() {});
    expect(Fresh.mixins.DataManager
           .fetchDataFromServer.callCount).toEqual(0);
  });

  it("should populate state.data with fetched data", function() {
    var DataManagerWidget = React.createClass(DataManagerSpec),
        widgetInstance = DataManagerWidget({});

    // React Components need to be rendered to mount
    React.renderComponentToString(widgetInstance, function() {});
    widgetInstance.receiveDataFromServer({
      name: 'John Doe',
      age: 42
    });
    expect(widgetInstance.state.data).toEqual({
      name: 'John Doe',
      age: 42
    });
  });
});
