const FIXTURE = 'selected-fixture-and-editor';

describe(`ComponentPlayground (${FIXTURE}) Events Handlers`, () => {
  const _ = require('lodash');
  const render = require('helpers/render-component');
  const localStorageLib = require('component-playground/lib/local-storage');

  const fixture = require(`fixtures/component-playground/${FIXTURE}`);
  const initialSplitPos = 207;

  let component;
  let $component;
  let container;

  beforeEach(() => {
    localStorageLib.set('splitPos', initialSplitPos);

    ({ container, component, $component } = render(fixture));
  });

  describe('on fixture update', () => {
    let stateSet;

    beforeEach(() => {
      sinon.spy(component, 'setState');

      component.onMessage({
        data: {
          type: 'fixtureUpdate',
          fixtureBody: {
            state: {
              somethingHappened: true,
            },
          },
        },
      });

      stateSet = component.setState.lastCall.args[0];
    });

    afterEach(() => {
      component.setState.restore();
    });

    it('should mark user input state as valid', () => {
      expect(stateSet.isFixtureUserInputValid).to.equal(true);
    });

    it('should override fixture part', () => {
      expect(stateSet.fixtureContents).to.deep.equal({
        ...fixture.state.fixtureContents,
        state: {
          somethingHappened: true,
        },
      });
    });

    it('should update stringified child snapshot state', () => {
      expect(stateSet.fixtureUserInput).to.equal(JSON.stringify({
        ...fixture.state.fixtureContents,
        state: {
          somethingHappened: true,
        },
      }, null, 2));
    });
  });

  it('should get split-pane default size from local storage', () => {
    expect(component.refs.splitPane.props.defaultSize).to.equal(initialSplitPos);
  });

  it('should save split-pane position in local storage on change', () => {
    component.refs.splitPane.props.onChange(102);
    expect(localStorageLib.get('splitPos')).to.equal(102);
  });
});
