var Fresh = require('../build/fresh.js'),
    React = require('react'),
    _ = require('underscore');

describe("Components implementing the DataManager mixin", function() {

  var DataManagerSpec = {
    mixins: [Fresh.mixins.DataManager],
    render: function() {
      return React.DOM.span(null, 'nada');
    }
  };

  it("should default initial data to an empty object", function() {
    // The fetching method should do nothing, we only care that it is called
    // before the components gets mounted
    spyOn(Fresh.mixins.DataManager, 'fetchDataFromServer');
    var DataManagerComponent = React.createClass(DataManagerSpec),
        componentInstance = DataManagerComponent();

    // React Components need to be rendered to mount
    React.renderComponentToString(componentInstance);
    expect(componentInstance.state.data).toEqual({});
    // Since expect([]).toEqual({}) returns true we had to know for sure that
    // the data object is a plain one
    expect(JSON.stringify(componentInstance.state.data)).toEqual('{}');
  });

  it("should override initial data to an empty array", function() {
    // The fetching method should do nothing, we only care that it is called
    // before the components gets mounted
    spyOn(Fresh.mixins.DataManager, 'fetchDataFromServer');
    var InitialDataSpec = _.extend({initialData: []}, DataManagerSpec),
        DataManagerComponent = React.createClass(InitialDataSpec),
        componentInstance = DataManagerComponent();

    // React Components need to be rendered to mount
    React.renderComponentToString(componentInstance);
    expect(componentInstance.state.data).toEqual([]);
    // Since expect([]).toEqual({}) returns true we had to know for sure that
    // the data object is an Array
    expect(JSON.stringify(componentInstance.state.data)).toEqual('[]');
  });

  it("should override initial data with non-empty value", function() {
    // The fetching method should do nothing, we only care that it is called
    // before the components gets mounted
    spyOn(Fresh.mixins.DataManager, 'fetchDataFromServer');
    var initialData = {name: 'Guest'},
        InitialDataSpec = _.extend({initialData: initialData}, DataManagerSpec),
        DataManagerComponent = React.createClass(InitialDataSpec),
        componentInstance = DataManagerComponent();

    // React Components need to be rendered to mount
    React.renderComponentToString(componentInstance);
    expect(componentInstance.state.data).toEqual({name: 'Guest'});
  });

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
    componentInstance.receiveDataFromServer({name: 'John Doe', age: 42});
    expect(componentInstance.state.data).toEqual({name: 'John Doe', age: 42});
  });

  it("should replace initial data after data is fetched", function() {
    // The fetching method should do nothing, we only care that it is called
    // before the components gets mounted
    spyOn(Fresh.mixins.DataManager, 'fetchDataFromServer');
    var initialData = {guest: true, name: 'Guest'},
        InitialDataSpec = _.extend({initialData: initialData}, DataManagerSpec),
        DataManagerComponent = React.createClass(InitialDataSpec),
        componentInstance = DataManagerComponent();

    // React Components need to be rendered to mount
    React.renderComponentToString(componentInstance);
    expect(componentInstance.state.data).toEqual({name: 'Guest', guest: true});
    componentInstance.receiveDataFromServer({name: 'John Doe', age: 42});
    expect(componentInstance.state.data).toEqual({name: 'John Doe', age: 42});
  });
});
