var React = require('react'),
    ReactDOM = require('react-dom-polyfill')(React),
    render = require('../../src/render.js').render;

describe('INTEGRATION Render stateless component', function() {
  var domContainer,
      children = [React.createElement('span', {
        key: '1',
        children: 'test child'
      })];

  var StatelessComponent = (props) =>
    <div>{props.children ? props.children : props.foo}</div>;

  beforeEach(function() {
    domContainer = document.createElement('div');
  });

  afterEach(function() {
    ReactDOM.unmountComponentAtNode(domContainer);
  });

  it('should render component using correct props', function() {
    render({
      component: StatelessComponent,
      snapshot: {
        foo: 'bar'
      },
      container: domContainer
    });

    expect(domContainer.innerText).to.equal('bar');
  });

  it('should receive children through props', function() {
    render({
      component: StatelessComponent,
      snapshot: {
        children: children
      },
      container: domContainer
    });

    expect(domContainer.innerText).to.equal('test child');
  });
});
