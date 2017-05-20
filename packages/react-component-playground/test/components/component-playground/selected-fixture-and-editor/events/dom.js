const FIXTURE = 'selected-fixture-and-editor';

describe(`ComponentPlayground (${FIXTURE}) Events DOM`, () => {
  const utils = require('react-dom/test-utils');
  const CodeMirror = require('codemirror');
  const render = require('helpers/render-component');

  const fixture = require(`fixtures/component-playground/${FIXTURE}`);

  let component;
  let $component;
  let container;
  let postMessage;

  beforeEach(() => {
    ({ container, component, $component } = render(fixture));

    postMessage = sinon.spy();
    component.loaderFrame = {
      contentWindow: {
        postMessage,
      },
    };
  });

  describe('Editor events', () => {
    let stateSet;

    function triggerEditorEvent(event, eventData) {
      const editor = component.refs.editor.getCodeMirror();
      sinon.spy(component, 'setState');

      if (event === 'change') {
        // Fully replace editor text (from the beginning to the end)
        // with the given string.
        editor.replaceRange(eventData, { line: 0, ch: 0 },
          // eslint-disable-next-line new-cap
          CodeMirror.Pos(editor.lastLine()), '+input');
      } else {
        CodeMirror.signal(editor, event, eventData);
      }

      stateSet = component.setState.lastCall.args[0];

      component.setState.restore();
    }

    it('should set state flag on editor focus', () => {
      triggerEditorEvent('focus');

      expect(stateSet.isEditorFocused).to.equal(true);
    });

    it('should unset state flag on editor blur', () => {
      triggerEditorEvent('blur');

      expect(stateSet.isEditorFocused).to.equal(false);
    });

    it('should update fixture user input on change', () => {
      triggerEditorEvent('change', '{"foo":"bar"}');

      expect(stateSet.fixtureUserInput).to.equal('{"foo":"bar"}');
    });

    it('should empty fixture contents on empty input', () => {
      triggerEditorEvent('change', '');

      expect(stateSet.fixtureContents).to.deep.equal({});
    });

    it('should not alter the original fixture contents', () => {
      triggerEditorEvent('change', '{"nested": {"foo": "foo"}}');

      expect(fixture.fixtures.FirstComponent.default.nested.foo).to.equal('bar');
    });

    describe('Valid editor input', () => {
      beforeEach(() => {
        triggerEditorEvent('change', '{"lorem": "ipsum"}');
      });

      it('should update fixture contents', () => {
        expect(stateSet.fixtureContents.lorem).to.equal('ipsum');
      });

      it('should mark valid change in state', () => {
        expect(stateSet.isFixtureUserInputValid).to.equal(true);
      });

      it('should send `fixtureChange` event', () => {
        expect(postMessage).to.have.been.calledWith({
          type: 'fixtureChange',
          fixtureBody: { lorem: 'ipsum' },
        }, '*');
      });
    });

    describe('Invalid editor input', () => {
      beforeEach(() => {
        sinon.stub(console, 'error');

        triggerEditorEvent('change', 'lorem ipsum');
      });

      afterEach(() => {
        console.error.restore();
      });

      it('should not update fixture contents', () => {
        expect(stateSet.fixtureContents).to.be.undefined;
      });

      it('should call console.error', () => {
        expect(console.error.lastCall.args[0]).to.be.an.instanceof(Error);
      });

      it('should mark invalid change in state', () => {
        expect(stateSet.isFixtureUserInputValid).to.equal(false);
      });
    });
  });
});
