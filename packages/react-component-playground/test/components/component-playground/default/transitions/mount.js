const FIXTURE = 'default';

describe(`ComponentPlayground (${FIXTURE}) Transitions Mount`, () => {
  const React = require('react');
  const ReactDOM = require('react-dom');
  const render = require('helpers/render-component');

  const fixture = require(`fixtures/component-playground/${FIXTURE}`);

  let component;
  let $component;
  let container;

  beforeEach(() => {
    sinon.stub(window, 'addEventListener');
    sinon.stub(window, 'removeEventListener');

    ({ container, component, $component } = render(fixture));
  });

  afterEach(() => {
    window.addEventListener.restore();
    window.removeEventListener.restore();
  });

  it('should add window resize listener on mount', () => {
    expect(window.addEventListener).to.have.been.calledWith(
        'resize', component.onWindowResize);
  });

  it('should add window message listener on mount', () => {
    expect(window.addEventListener).to.have.been.calledWith(
        'message', component.onMessage);
  });

  it('should remove window resize listener on unmount', () => {
    ReactDOM.unmountComponentAtNode(container);

    expect(window.removeEventListener).to.have.been.calledWith(
        'resize', component.onWindowResize);
  });

  it('should remove window message listener on unmount', () => {
    ReactDOM.unmountComponentAtNode(container);

    expect(window.removeEventListener).to.have.been.calledWith(
        'message', component.onMessage);
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

    it('should have fixture editor marked as not focused', () => {
      expect(component.state.isEditorFocused).to.equal(false);
    });

    it('should have landscape orientation', () => {
      expect(component.state.orientation).to.equal('landscape');
    });
  });
});
