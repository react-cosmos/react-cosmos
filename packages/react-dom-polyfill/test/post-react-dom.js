/* eslint-disable import/no-webpack-loader-syntax */
const reactDOMPolyfillInjector = require('inject?react-dom!../src');

describe('DOMPolyfill Post React DOM (>=0.14)', () => {
  // Make sure version is parsed correctly
  ['0.14', '0.14.8', '15', '15.3.1'].forEach((version) => {
    const ReactMock = {
      version,
    };
    const ReactDOMMock = {
      findDOMNode: sinon.spy(),
      render: sinon.spy(),
      unmountComponentAtNode: sinon.spy(),
    };

    let ReactDOM;

    beforeEach(() => {
      const reactDOMPolyfill = reactDOMPolyfillInjector({ 'react-dom': ReactDOMMock });
      ReactDOM = reactDOMPolyfill(ReactMock);
    });

    it(`${version} should render using React DOM`, () => {
      const reactElement = {};
      const domElement = {};

      ReactDOM.render(reactElement, domElement);
      expect(ReactDOMMock.render).to.have.been.calledWith(reactElement, domElement);
    });

    it(`${version} should unmount using React DOM`, () => {
      const domElement = {};

      ReactDOM.unmountComponentAtNode(domElement);
      expect(ReactDOMMock.unmountComponentAtNode)
          .to.have.been.calledWith(domElement);
    });

    it(`${version} should find DOM node using React DOM`, () => {
      const element = {};

      // XXX: Relies on the fact that ReactDOM.findDOMNode returns dom elements as is
      // http://bit.ly/2c7TUcD
      ReactDOM.findDOMNode(element);
      expect(ReactDOMMock.findDOMNode).to.have.been.calledWith(element);
    });
  });
});
