/* eslint-env browser, mocha */
/* eslint-disable
  global-require,
  no-unused-vars,
  no-unused-expressions,
  import/no-unresolved,
  import/no-extraneous-dependencies
*/
/* global expect, sinon */

const FIXTURE = 'default';

describe(`ComponentPlayground (${FIXTURE}) Transitions Mount`, () => {
  const React = require('react');
  const ReactDOM = require('react-dom-polyfill')(React);
  const render = require('helpers/render-component');

  const fixture = require(`fixtures/component-playground/${FIXTURE}`);

  let component;
  let $component;
  let container;

  const timeoutId = 555;

  beforeEach(() => {
    sinon.stub(window, 'setInterval').returns(timeoutId);
    sinon.stub(window, 'clearInterval');
    sinon.stub(window, 'addEventListener');
    sinon.stub(window, 'removeEventListener');

    ({ container, component, $component } = render(fixture));
  });

  afterEach(() => {
    window.setInterval.restore();
    window.clearInterval.restore();
    window.addEventListener.restore();
    window.removeEventListener.restore();
  });

  it('should register fixture update interval on mount', () => {
    const setIntervalArgs = window.setInterval.lastCall.args;
    expect(setIntervalArgs[0]).to.equal(component.onFixtureUpdate);
    expect(setIntervalArgs[1]).to.equal(100);
  });

  it('should clear fixture update interval on unmount', () => {
    ReactDOM.unmountComponentAtNode(container);

    expect(window.clearInterval).to.have.been.calledWith(timeoutId);
  });

  it('should add window resize listener on mount', () => {
    expect(window.addEventListener).to.have.been.calledWith(
        'resize', component.onWindowResize);
  });

  it('should remove window resize listener on unmount', () => {
    ReactDOM.unmountComponentAtNode(container);

    expect(window.removeEventListener).to.have.been.calledWith(
        'resize', component.onWindowResize);
  });

  describe('default state', () => {
    it('should have empty fixture contents', () => {
      expect(component.state.fixtureContents).to.deep.equal({});
    });

    it('should have empty object literal in fixture user input', () => {
      expect(component.state.fixtureUserInput).to.equal('{}');
    });

    it('should have fixture user input marked as valid', () => {
      expect(component.state.isFixtureUserInputValid).to.equal(true);
    });

    it('should have fixture change counter set to 0', () => {
      expect(component.state.fixtureChange).to.equal(0);
    });

    it('should have fixture editor marked as not focused', () => {
      expect(component.state.isEditorFocused).to.equal(false);
    });

    it('should have landscape orientation', () => {
      expect(component.state.orientation).to.equal('landscape');
    });
  });
});
