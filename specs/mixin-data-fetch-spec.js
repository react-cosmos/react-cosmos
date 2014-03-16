var Cosmos = require('../build/cosmos.js'),
    React = require('react'),
    _ = require('underscore');

describe("Components implementing the DataFetch mixin", function() {

  var DataFetchSpec = {
    mixins: [Cosmos.mixins.DataFetch],
    render: function() {
      return React.DOM.span(null, 'nada');
    }
  };

  it("should default initial data to an empty object", function() {
    // The fetching method should do nothing, we only care that it is called
    // before the components gets mounted
    spyOn(Cosmos.mixins.DataFetch, 'fetchDataFromServer');
    var DataFetchComponent = React.createClass(DataFetchSpec),
        componentInstance = DataFetchComponent();

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
    spyOn(Cosmos.mixins.DataFetch, 'fetchDataFromServer');
    var InitialDataSpec = _.extend({initialData: []}, DataFetchSpec),
        DataFetchComponent = React.createClass(InitialDataSpec),
        componentInstance = DataFetchComponent();

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
    spyOn(Cosmos.mixins.DataFetch, 'fetchDataFromServer');
    var initialData = {name: 'Guest'},
        InitialDataSpec = _.extend({initialData: initialData}, DataFetchSpec),
        DataFetchComponent = React.createClass(InitialDataSpec),
        componentInstance = DataFetchComponent();

    // React Components need to be rendered to mount
    React.renderComponentToString(componentInstance);
    expect(componentInstance.state.data).toEqual({name: 'Guest'});
  });

  it("should fetch data if a 'dataUrl' prop is set", function() {
    // The fetching method should do nothing, we only care that it is called
    // before the components gets mounted
    spyOn(Cosmos.mixins.DataFetch, 'fetchDataFromServer');
    var DataFetchComponent = React.createClass(DataFetchSpec),
        componentInstance = DataFetchComponent({dataUrl: 'url?query=string'});

    // React Components need to be rendered to mount
    React.renderComponentToString(componentInstance);
    expect(Cosmos.mixins.DataFetch
           .fetchDataFromServer.callCount).toEqual(1);
  });

  it("shouldn't fetch data if a 'dataUrl' prop isn't set", function() {
    // The fetching method should do nothing, we only care that it is called
    // before the components gets mounted
    spyOn(Cosmos.mixins.DataFetch, 'fetchDataFromServer');
    var DataFetchComponent = React.createClass(DataFetchSpec),
        componentInstance = DataFetchComponent({});

    // React Components need to be rendered to mount
    React.renderComponentToString(componentInstance);
    expect(Cosmos.mixins.DataFetch
           .fetchDataFromServer.callCount).toEqual(0);
  });

  it("should populate state.data with fetched data", function() {
    var DataFetchComponent = React.createClass(DataFetchSpec),
        componentInstance = DataFetchComponent({});

    // React Components need to be rendered to mount
    React.renderComponentToString(componentInstance);
    componentInstance.receiveDataFromServer({name: 'John Doe', age: 42});
    expect(componentInstance.state.data).toEqual({name: 'John Doe', age: 42});
  });

  it("should replace initial data after data is fetched", function() {
    // The fetching method should do nothing, we only care that it is called
    // before the components gets mounted
    spyOn(Cosmos.mixins.DataFetch, 'fetchDataFromServer');
    var initialData = {guest: true, name: 'Guest'},
        InitialDataSpec = _.extend({initialData: initialData}, DataFetchSpec),
        DataFetchComponent = React.createClass(InitialDataSpec),
        componentInstance = DataFetchComponent();

    // React Components need to be rendered to mount
    React.renderComponentToString(componentInstance);
    expect(componentInstance.state.data).toEqual({name: 'Guest', guest: true});
    componentInstance.receiveDataFromServer({name: 'John Doe', age: 42});
    expect(componentInstance.state.data).toEqual({name: 'John Doe', age: 42});
  });
});
