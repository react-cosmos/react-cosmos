import React from 'react';
import _ from 'lodash';
import { loadChild } from '../../src/load-child.js';

const ReactComponent = {
  prototype: {
    render: () => ({}),
  },
};
const StatelessComponent = {
  prototype: {},
};

describe('UNIT Load child', () => {
  const FirstComponent = _.cloneDeep(ReactComponent);
  const SecondComponent = _.cloneDeep(ReactComponent);
  const ThirdComponent = _.cloneDeep(StatelessComponent);
  const children = [React.createElement('span', {
    key: '1',
    children: 'test child',
  })];

  let component;

  beforeEach(() => {
    component = {
      children: {
        defaultRef: sinon.spy(() => ({
          component: FirstComponent,
          alwaysTrue: true,
          children,
        })),
        customRef: sinon.spy(() => ({
          component: SecondComponent,
          ref: 'fooChild',
        })),
        omittedRef: () => ({
          component: ThirdComponent,
        }),
      },
    };

    sinon.stub(React, 'createElement');
  });

  afterEach(() => {
    React.createElement.restore();
  });

  it('should call .children function', () => {
    loadChild(component, 'defaultRef');

    expect(component.children.defaultRef).to.have.been.called;
  });

  it('should call .children function with component context', () => {
    loadChild(component, 'defaultRef');

    expect(component.children.defaultRef).to.have.been.calledOn(component);
  });

  it('should call .children function with extra args', () => {
    loadChild(component, 'customRef', 'first', 'second');

    expect(component.children.customRef)
          .to.have.been.calledWith('first', 'second');
  });

  it('should create element using returned component class', () => {
    loadChild(component, 'defaultRef');

    expect(React.createElement.lastCall.args[0]).to.equal(FirstComponent);
  });

  it('should create element using returned props', () => {
    loadChild(component, 'defaultRef');

    const props = React.createElement.lastCall.args[1];
    expect(props.alwaysTrue).to.equal(true);
  });

  it('should omit component param from props', () => {
    loadChild(component, 'defaultRef');

    const props = React.createElement.lastCall.args[1];
    expect(props.component).to.be.undefined;
  });

  it('should omit children param from props', () => {
    loadChild(component, 'defaultRef');

    const props = React.createElement.lastCall.args[1];
    expect(props.children).to.be.undefined;
  });

  it('should create element using returned children', () => {
    loadChild(component, 'defaultRef');

    expect(React.createElement.lastCall.args[2]).to.equal(children);
  });

  it('should use child name as ref if omitted', () => {
    loadChild(component, 'defaultRef');

    const props = React.createElement.lastCall.args[1];
    expect(props.ref).to.equal('defaultRef');
  });

  it('should use returned ref when present', () => {
    loadChild(component, 'customRef');

    const props = React.createElement.lastCall.args[1];
    expect(props.ref).to.equal('fooChild');
  });

  it('should omit ref for stateless components', () => {
    loadChild(component, 'omittedRef');

    const props = React.createElement.lastCall.args[1];
    expect(props.ref).to.be.undefined;
  });
});
