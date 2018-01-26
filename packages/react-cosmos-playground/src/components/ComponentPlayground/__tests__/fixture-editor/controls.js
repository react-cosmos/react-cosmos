import until from 'async-until';
import { createContext } from '../../../../utils/enzyme';
import DragHandle from '../../../DragHandle';
import fixture from '../../__fixtures__/selected-editor';

const postMessage = jest.fn();
const { mount, getWrapper, getRef } = createContext({
  fixture,
  async beforeInit() {
    await until(() => getRef().loaderFrame);
    getRef().loaderFrame = {
      contentWindow: {
        postMessage
      }
    };
  }
});

// Fixture editor is already on so the button will untoggle it
const fixtureEditorUrl = '?component=ComponentA&fixture=foo';

describe('Fixture editor controls', () => {
  beforeEach(mount);

  it('should set untoggle URL to fixture editor button', () => {
    expect(getWrapper(`.header a[href="${fixtureEditorUrl}"]`)).toHaveLength(1);
  });

  it('should render selected fixture editor button', () => {
    expect(
      getWrapper(`.header a[href="${fixtureEditorUrl}"].selectedButton`)
    ).toHaveLength(1);
  });

  it('should render DragHandle in fixture editor pane', () => {
    expect(getWrapper('.fixtureEditorPane').find(DragHandle)).toHaveLength(1);
  });
});
