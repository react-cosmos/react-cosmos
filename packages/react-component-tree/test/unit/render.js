var React = require('react'),
    ReactDOM = require('react-dom-polyfill')(React),
    render = require('../../src/render.js').render;

describe('UNIT Render', function() {
  var domContainer,
      children = [React.createElement('span', {
        key: '1',
        children: 'test child'
      })];

  class Component extends React.Component {
    render() {
      return React.DOM.span();
    }
  }

  beforeEach(function() {
    sinon.spy(React, 'createElement');
    sinon.stub(ReactDOM, 'render');

    domContainer = document.createElement('div');

    render({
      component: Component,
      snapshot: {
        foo: 'bar',
        children: children
      },
      container: domContainer
    });
  });

  afterEach(function() {
    React.createElement.restore();
    ReactDOM.render.restore();
  });

  it('should create element for component', function() {
    var args = React.createElement.lastCall.args;
    expect(args[0]).to.equal(Component);
  });

  it('should create element with props', function() {
    var args = React.createElement.lastCall.args;
    expect(args[1].foo).to.equal('bar');
  });

  it('should omit children from props', function() {
    var args = React.createElement.lastCall.args;
    expect(args[1].children).to.be.undefined;
  });

  it('should create element with children', function() {
    var args = React.createElement.lastCall.args;
    expect(args[2]).to.be.equal(children);
  });

  it('should render created element', function() {
    var args = ReactDOM.render.lastCall.args;
    expect(args[0]).to.equal(React.createElement.returnValues[0]);
  });

  it('should render in given container', function() {
    var args = ReactDOM.render.lastCall.args;
    expect(args[1]).to.equal(domContainer);
  });
});
