import React from 'react';
import createReactClass from 'create-react-class';
import { renderIntoDocument } from 'react-dom/test-utils';
import loadChild from '../../src/load-child';
import LoadChildMixin from '../../src/load-child-mixin';

describe('UNIT Load child mixin', () => {
  const fakeReactElement = {};
  let myComponent;

  const MyComponent = createReactClass({
    mixins: [LoadChildMixin],
    children: {},

    render: () => React.DOM.span(),
  });

  beforeEach(() => {
    sinon.stub(loadChild, 'loadChild').returns(fakeReactElement);

    myComponent = renderIntoDocument(React.createElement(MyComponent, {}));
  });

  afterEach(() => {
    loadChild.loadChild.restore();
  });

  it('should call loadChild lib with same args', () => {
    myComponent.loadChild('myChild', 5, 10, true);

    const args = loadChild.loadChild.lastCall.args;
    expect(args[0]).to.equal(myComponent);
    expect(args[1]).to.equal('myChild');
    expect(args[2]).to.equal(5);
    expect(args[3]).to.equal(10);
    expect(args[4]).to.equal(true);
  });

  it('should return what loadChild lib returned', () => {
    expect(myComponent.loadChild()).to.equal(fakeReactElement);
  });
});
