var Fresh = require('../build/fresh.js'),
    React = require('react');

describe("Components implementing the DataManager mixin", function() {

  var DataManagerSpec = {
    mixins: [Fresh.mixins.DataManager],
    render: function() {
      return React.DOM.span(null, 'nada');
    }
  };

  it("should fetch data if a 'data' prop is set", function() {
    // The fetching method should do nothing, we only care that it is called
    // before the components gets mounted
    spyOn(Fresh.mixins.DataManager, 'fetchDataFromServer');
    var DataManagerComponent = React.createClass(DataManagerSpec),
        componentInstance = DataManagerComponent({data: 'url?query=string'});

    // React Components need to be rendered to mount
    React.renderComponentToString(componentInstance);
    expect(Fresh.mixins.DataManager
           .fetchDataFromServer.callCount).toEqual(1);
  });

  it("shouldn't fetch data if a 'data' prop isn't set", function() {
    // The fetching method should do nothing, we only care that it is called
    // before the components gets mounted
    spyOn(Fresh.mixins.DataManager, 'fetchDataFromServer');
    var DataManagerComponent = React.createClass(DataManagerSpec),
        componentInstance = DataManagerComponent({});

    // React Components need to be rendered to mount
    React.renderComponentToString(componentInstance);
    expect(Fresh.mixins.DataManager
           .fetchDataFromServer.callCount).toEqual(0);
  });

  it("should populate state.data with fetched data", function() {
    var DataManagerComponent = React.createClass(DataManagerSpec),
        componentInstance = DataManagerComponent({});

    // React Components need to be rendered to mount
    React.renderComponentToString(componentInstance);
    componentInstance.receiveDataFromServer({
      name: 'John Doe',
      age: 42
    });
    expect(componentInstance.state.data).toEqual({
      name: 'John Doe',
      age: 42
    });
  });
});
