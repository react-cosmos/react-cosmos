import React from 'react';
import ReactDOM from 'react-dom';
import { render } from '../../src/render';

describe('INTEGRATION Render and inject state', () => {
  let domContainer;
  let component;

  class ChildComponent extends React.Component {
    render() {
      return React.DOM.span();
    }
  }

  class ParentComponent extends React.Component {
    render() {
      return React.createElement(ChildComponent, { ref: 'child' });
    }
  }

  class GrandparentComponent extends React.Component {
    render() {
      return React.createElement(ParentComponent, { ref: 'child' });
    }
  }

  beforeEach(() => {
    domContainer = document.createElement('div');
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(domContainer);
  });

  it('should set state on root component', () => {
    component = render({
      component: GrandparentComponent,
      snapshot: {
        state: { foo: 'bar' },
      },
      container: domContainer,
    });

    expect(component.state.foo).to.equal('bar');
  });

  it('should set state on child component', () => {
    component = render({
      component: GrandparentComponent,
      snapshot: {
        state: {
          children: {
            child: { foo: 'bar' },
          },
        },
      },
      container: domContainer,
    });

    expect(component.refs.child.state.foo).to.equal('bar');
  });

  it('should set state on grandchild component', () => {
    component = render({
      component: GrandparentComponent,
      snapshot: {
        state: {
          children: {
            child: {
              children: {
                child: { foo: 'bar' },
              },
            },
          },
        },
      },
      container: domContainer,
    });

    expect(component.refs.child.refs.child.state.foo).to.equal('bar');
  });
});
