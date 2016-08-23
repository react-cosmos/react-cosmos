var React = require('react'),
    ReactDOM = require('react-dom-polyfill')(React),
    render = require('../../src/render.js').render;

describe('INTEGRATION Render', function() {
  var domContainer,
      children = [React.createElement('span', {
        key: '1',
        children: 'test child'
      })],
      component;

  class Component extends React.Component {
    render() {
      return React.DOM.span();
    }
  }

  beforeEach(function() {
    domContainer = document.createElement('div');

    component = render({
      component: Component,
      snapshot: {
        foo: 'bar',
        children: children
      },
      container: domContainer
    });
  });

  afterEach(function() {
    ReactDOM.unmountComponentAtNode(domContainer);
  });

  it('should create component with correct props', function() {
    expect(component.props.foo).to.equal('bar');
  });

  it('should receive children through props', function() {
    expect(component.props.children).to.be.equal(children);
  });

  it('should render in given container', function() {
    expect(ReactDOM.findDOMNode(component).parentNode).to.equal(domContainer);
  });
});
