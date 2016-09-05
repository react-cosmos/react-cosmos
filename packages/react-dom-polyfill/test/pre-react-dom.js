/* eslint-env node, mocha */
/* eslint-disable react/no-find-dom-node */
/* global expect, sinon */

const reactDOMPolyfill = require('../src');

describe('DOMPolyfill Pre React DOM (<0.14)', () => {
  // Make sure version is parsed correctly
  ['0.12', '0.12.2', '0.13', '0.13.3'].forEach((version) => {
    const ReactMock = {
      version,
      render: sinon.spy(),
      unmountComponentAtNode: sinon.spy(),
    };

    let ReactDOM;

    beforeEach(() => {
      ReactDOM = reactDOMPolyfill(ReactMock);
    });

    it(`${version} should render using React`, () => {
      const reactElement = {};
      const domElement = {};

      ReactDOM.render(reactElement, domElement);
      expect(ReactMock.render).to.have.been.calledWith(reactElement, domElement);
    });

    it(`${version} should unmount using React`, () => {
      const domElement = {};

      ReactDOM.unmountComponentAtNode(domElement);
      expect(ReactMock.unmountComponentAtNode)
          .to.have.been.calledWith(domElement);
    });

    it(`${version} should find DOM node of React Element`, () => {
      const domElement = {};
      const element = {
        getDOMNode: sinon.stub().returns(domElement),
      };

      expect(ReactDOM.findDOMNode(element)).to.equal(domElement);
    });

    it(`${version} should return DOM node as is`, () => {
      const element = {};

      expect(ReactDOM.findDOMNode(element)).to.equal(element);
    });
  });
});
