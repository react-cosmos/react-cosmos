var _ = require('lodash'),
    React = require('react'),
    TestUtils = require('react-addons-test-utils'),
    renderIntoDocument = TestUtils.renderIntoDocument,
    loadChild = require('../../src/load-child.js'),
    LoadChildMixin = require('../../src/load-child-mixin.js');

describe('UNIT Load child mixin', function() {
  var fakeReactElement = {},
      myComponent;

  var MyComponent = React.createClass({
    mixins: [LoadChildMixin],
    children: {},

    render: function() {
      return React.DOM.span();
    }
  });

  beforeEach(function() {
    sinon.stub(loadChild, 'loadChild').returns(fakeReactElement);

    myComponent = renderIntoDocument(React.createElement(MyComponent, {}));
  });

  afterEach(function() {
    loadChild.loadChild.restore();
  });

  it('should call loadChild lib with same args', function() {
    myComponent.loadChild('myChild', 5, 10, true);

    var args = loadChild.loadChild.lastCall.args;
    expect(args[0]).to.equal(myComponent);
    expect(args[1]).to.equal('myChild');
    expect(args[2]).to.equal(5);
    expect(args[3]).to.equal(10);
    expect(args[4]).to.equal(true);
  });

  it('should return what loadChild lib returned', function() {
    expect(myComponent.loadChild()).to.equal(fakeReactElement);
  });
});
