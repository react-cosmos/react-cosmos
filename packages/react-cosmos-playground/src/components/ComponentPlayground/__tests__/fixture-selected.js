import until from 'async-until';
import { createContext } from '../../../utils/enzyme';
import StarryBg from '../../StarryBg';
import FixtureList from '../../FixtureList';
import fixture from '../__fixtures__/selected';

const postMessage = jest.fn();

const { mount, unmount, getWrapper, getRef } = createContext({
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

describe('CP with fixture already selected', () => {
  beforeEach(async () => {
    postMessage.mockClear();
    await mount();
  });

  afterEach(() => {
    unmount();
  });

  it('sends fixture select message to loader', () => {
    expect(postMessage).toHaveBeenCalledWith(
      {
        type: 'fixtureSelect',
        component: 'ComponentA',
        fixture: 'foo'
      },
      '*'
    );
  });

  describe('fixture list', () => {
    let props;

    beforeEach(() => {
      props = getWrapper(FixtureList).props();
    });

    it('should send url params (component, fixture) to fixture list', () => {
      expect(props.urlParams).toEqual({
        component: 'ComponentA',
        fixture: 'foo'
      });
    });

    it('clicking on selected fixture sends new message to loader', () => {
      props.onUrlChange(window.location.href);
      expect(postMessage).toHaveBeenCalledTimes(2);
      expect(postMessage).toHaveBeenLastCalledWith(
        {
          type: 'fixtureSelect',
          component: 'ComponentA',
          fixture: 'foo'
        },
        '*'
      );
    });
  });

  describe('main menu', () => {
    const fixtureEditorUrl = '?component=ComponentA&fixture=foo&editor=true';
    const fullScreenUrl = '?component=ComponentA&fixture=foo&fullScreen=true';

    it('should render home button', () => {
      expect(getWrapper('a[href="?"].button')).toHaveLength(1);
    });

    it('should not render selected home button', () => {
      expect(getWrapper('a[href="?"].selectedButton')).toHaveLength(0);
    });

    it('should render fixture editor button', () => {
      expect(getWrapper(`a[href="${fixtureEditorUrl}"].button`)).toHaveLength(
        1
      );
    });

    it('should not render selected fixture editor button', () => {
      expect(
        getWrapper(`a[href="${fixtureEditorUrl}"].selectedButton`).length
      ).toBe(0);
    });

    it('should render full screen button', () => {
      expect(getWrapper(`a[href="${fullScreenUrl}"].button`)).toHaveLength(1);
    });
  });

  describe('content', () => {
    it('should not render StarryBg', () => {
      expect(getWrapper(StarryBg)).toHaveLength(0);
    });
  });
});
