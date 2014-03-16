var Cosmos = require('../build/cosmos.js'),
    React = require('react');

describe("Components implementing the Url mixin", function() {

  var UrlSpec = {
    mixins: [Cosmos.mixins.PersistState,
             Cosmos.mixins.Url],
    render: function() {
      return React.DOM.span(null, 'nada');
    }
  };

  it("should generate url with escaped props and state", function() {
    var UrlComponent = React.createClass(UrlSpec),
        componentInstance = UrlComponent({
          players: 5,
          state: {speed: 1}
        }),
        snapshot;
    // React Components need to be rendered to mount
    React.renderComponentToString(componentInstance);
    expect(componentInstance.getUrlFromProps(componentInstance.generateSnapshot()))
      // encodeURIComponent(JSON.stringify({speed:1}))
      .toEqual('?players=5&state=%7B%22speed%22%3A1%7D');
  });
});
