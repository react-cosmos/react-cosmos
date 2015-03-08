var _ = require('lodash'),
    serialize = require('../../lib/serialize.js'),
    RouterMixin = require('../../mixins/router.js');

describe('Router mixin', function() {
  var fakeComponent;

  beforeEach(function() {
    fakeComponent = _.clone(RouterMixin);

    // Mock React API
    fakeComponent.props = {};

    sinon.stub(serialize, 'getQueryStringFromProps')
              .returns('players=5&state=%7B%22speed%22%3A1%7D');
  });

  afterEach(function() {
    serialize.getQueryStringFromProps.restore();
  })

  it('should get query string from serialize lib', function() {
    fakeComponent.getUrlFromProps();

    expect(serialize.getQueryStringFromProps).to.have.been.called;
  });

  it('should prepend escaped snapshot with question mark', function() {
    expect(fakeComponent.getUrlFromProps())
          // state=encodeURIComponent(JSON.stringify({speed:1}))
          .to.equal('?players=5&state=%7B%22speed%22%3A1%7D');
  });

  it('should call router instance from props', function() {
    fakeComponent.props.router = {
      goTo: sinon.spy()
    };

    // Fake the structure of an event
    fakeComponent.routeLink({
      preventDefault: function() {},
      currentTarget: {
        href: 'my-page?component=NextComponent'
      }
    });

    expect(fakeComponent.props.router.goTo)
          .to.have.been.calledWith('my-page?component=NextComponent');
  });
});
