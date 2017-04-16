import React from 'react';
import ReactDOM from 'react-dom';
import { render } from '../../src/render';

describe('INTEGRATION Render stateless component', () => {
  const children = [React.createElement('span', {
    key: '1',
    children: 'test child',
  })];

  let domContainer;

  const StatelessComponent = props =>

    <div>{props.children ? props.children : props.foo}</div>;

  beforeEach(() => {
    domContainer = document.createElement('div');
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(domContainer);
  });

  it('should render component using correct props', () => {
    render({
      component: StatelessComponent,
      snapshot: {
        foo: 'bar',
      },
      container: domContainer,
    });

    expect(domContainer.innerText).to.equal('bar');
  });

  it('should receive children through props', () => {
    render({
      component: StatelessComponent,
      snapshot: {
        children,
      },
      container: domContainer,
    });

    expect(domContainer.innerText).to.equal('test child');
  });
});
