const FIXTURE = 'selected-fixture-and-editor';

describe(`ComponentPlayground (${FIXTURE}) Events Handlers`, () => {
  const _ = require('lodash');
  const ComponentTree = require('react-component-tree');
  const render = require('helpers/render-component');
  const localStorageLib = require('component-playground/lib/local-storage');

  const fixture = require(`fixtures/component-playground/${FIXTURE}`);

  let component;
  let $component;
  let container;

  beforeEach(() => {
    ({ container, component, $component } = render(fixture));
  });

  describe('on fixture update', () => {
    let stateSet;

    beforeEach(() => {
      sinon.stub(ComponentTree, 'serialize').returns(_.merge({},
        fixture.state.fixtureContents,
        fixture.state.fixtureUnserializableProps));
      sinon.spy(component, 'setState');

      component.onFixtureUpdate();

      stateSet = component.setState.lastCall.args[0];
    });

    afterEach(() => {
      ComponentTree.serialize.restore();
      component.setState.restore();
    });

    it('should mark user input state as valid', () => {
      expect(stateSet.isFixtureUserInputValid).to.equal(true);
    });

    it('should serialize preview child', () => {
      expect(ComponentTree.serialize)
            .to.have.been.calledWith(component.previewComponent);
    });

    it('should put serializable child state in fixture contents', () => {
      Object.keys(fixture.state.fixtureContents).forEach((key) => {
        expect(stateSet.fixtureContents[key])
        .to.deep.equal(fixture.state.fixtureContents[key]);
      });
    });

    it('should ignore unserializable child state', () => {
      Object.keys(fixture.state.fixtureUnserializableProps).forEach((key) => {
        expect(stateSet.fixtureContents[key]).to.be.undefined;
      });
    });

    it('should update stringified child snapshot state', () => {
      expect(stateSet.fixtureUserInput)
            .to.equal(JSON.stringify(fixture.state.fixtureContents, null, 2));
    });
  });

  it('should save split-pane position in local storage on change', () => {
    expect(component.refs.splitPane.props.onChange())
      .to.equal(localStorageLib.set('splitPos'));
  });

  it('should get split-pane default size from local storage', () => {
    expect(component.refs.splitPane.props.defaultSize)
      .to.equal(localStorageLib.get('splitPos'));
  });
});
