var path = require('path');

var _ = require('lodash'),
    React = require('react'),
    TestUtils = require('react-addons-test-utils'),
    renderIntoDocument = TestUtils.renderIntoDocument,
    loadChild = require('../../src/load-child.js'),
    LoadChildComponent = require('../../src/load-child-component.js');

describe('UNIT Load child component', function() {
  var fakeReactElement = {},
      myComponent;

  class MyComponent extends LoadChildComponent {
    constructor(props) {
      super(props);
      this.children = {};
    }
    render() {
      return React.DOM.span();
    }
  }

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
