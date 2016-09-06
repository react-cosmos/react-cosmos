const FIXTURE = 'selected-fixture-and-editor';

describe(`ComponentPlayground (${FIXTURE}) Events DOM`, function () {
  var utils = require('react-addons-test-utils'),
    CodeMirror = require('codemirror'),
    render = require('helpers/render-component.js'),
    fixture = require(`fixtures/component-playground/${FIXTURE}.js`);

  var component,
    $component,
    container,
    fixture;

  beforeEach(function () {
    ({ container, component, $component } = render(fixture));
  });

  describe('Editor events', function () {
    let stateSet;

    function triggerEditorEvent(event, eventData) {
      const editor = component.refs.editor.getCodeMirror();
      sinon.spy(component, 'setState');

      if (event === 'change') {
        // Fully replace editor text (from the beginning to the end)
        // with the given string.
        editor.replaceRange(eventData, { line: 0, ch: 0 },
          CodeMirror.Pos(editor.lastLine()), '+input');
      } else {
        CodeMirror.signal(editor, event, eventData);
      }

      stateSet = component.setState.lastCall.args[0];

      component.setState.restore();
    }

    it('should set state flag on editor focus', function () {
      triggerEditorEvent('focus');

      expect(stateSet.isEditorFocused).to.equal(true);
    });

    it('should unset state flag on editor blur', function () {
      triggerEditorEvent('blur');

      expect(stateSet.isEditorFocused).to.equal(false);
    });

    it('should update fixture user input on change', function () {
      triggerEditorEvent('change', '{"foo":"bar"}');

      expect(stateSet.fixtureUserInput).to.equal('{"foo":"bar"}');
    });

    it('should empty fixture contents on empty input', function () {
      triggerEditorEvent('change', '');

      expect(stateSet.fixtureContents).to.deep.equal({});
    });

    it('should not alter the original fixture contents', function () {
      triggerEditorEvent('change', '{"nested": {"foo": "foo"}}');

      expect(fixture.components.FirstComponent
             .fixtures['default'].nested.foo).to.equal('bar');
    });

    describe('Valid editor input', function () {
      beforeEach(function () {
        triggerEditorEvent('change', '{"lorem": "ipsum"}');
      });

      it('should update fixture contents', function () {
        expect(stateSet.fixtureContents.lorem).to.equal('ipsum');
      });

      it('should mark valid change in state', function () {
        expect(stateSet.isFixtureUserInputValid).to.equal(true);
      });

      it('should bump fixture change counter', function () {
        expect(stateSet.fixtureChange)
              .to.equal(fixture.state.fixtureChange + 1);
      });
    });

    describe('Invalid editor input', function () {
      beforeEach(function () {
        sinon.stub(console, 'error');

        triggerEditorEvent('change', 'lorem ipsum');
      });

      afterEach(function () {
        console.error.restore();
      });

      it('should not update fixture contents', function () {
        expect(stateSet.fixtureContents).to.be.undefined;
      });

      it('should call console.error', function () {
        expect(console.error.lastCall.args[0]).to.be.an.instanceof(Error);
      });

      it('should mark invalid change in state', function () {
        expect(stateSet.isFixtureUserInputValid).to.equal(false);
      });

      it('should not bump fixture change counter', function () {
        expect(stateSet.fixtureChange).to.be.undefined;
      });
    });
  });
});
