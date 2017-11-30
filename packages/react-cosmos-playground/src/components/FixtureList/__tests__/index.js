import { createContext } from '../../../utils/enzyme';
import populatedFixture from '../__fixtures__/populated';
import populatedWithEditorFixture from '../__fixtures__/populated-with-editor';
import populatedAndSelectedFixture from '../__fixtures__/populated-and-selected';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('List', () => {
  const { getWrapper, mount } = createContext({ fixture: populatedFixture });

  beforeEach(mount);

  const getComponentA = () => getWrapper('.component').at(0);
  const getComponentB = () => getWrapper('.component').at(1);

  test('should render component names', () => {
    expect(getComponentA().text()).toContain('ComponentA');
    expect(getComponentB().text()).toContain('ComponentB');
  });

  test('should render fixture names', () => {
    expect(
      getComponentA()
        .find('.fixture')
        .at(0)
        .text()
    ).toContain('foo');
    expect(
      getComponentA()
        .find('.fixture')
        .at(1)
        .text()
    ).toContain('bar');

    expect(
      getComponentB()
        .find('.fixture')
        .at(0)
        .text()
    ).toContain('baz');
    expect(
      getComponentB()
        .find('.fixture')
        .at(1)
        .text()
    ).toContain('qux');
  });
});

describe('Links', () => {
  describe('editor closed', () => {
    const { getWrapper, mount } = createContext({
      fixture: populatedFixture
    });

    const getComponentA = () => getWrapper('.component').at(0);
    const getComponentB = () => getWrapper('.component').at(1);

    beforeEach(mount);

    test('link 1', () => {
      expect(
        getComponentA()
          .find('.fixture')
          .at(0)
          .prop('href')
      ).toEqual('?component=ComponentA&fixture=foo');
    });

    test('link 2', () => {
      expect(
        getComponentA()
          .find('.fixture')
          .at(1)
          .prop('href')
      ).toEqual('?component=ComponentA&fixture=bar');
    });

    test('link 3', () => {
      expect(
        getComponentB()
          .find('.fixture')
          .at(0)
          .prop('href')
      ).toEqual('?component=ComponentB&fixture=baz');
    });

    test('link 4', () => {
      expect(
        getComponentB()
          .find('.fixture')
          .at(1)
          .prop('href')
      ).toEqual('?component=ComponentB&fixture=qux');
    });
  });

  describe('editor open', () => {
    const { getWrapper, mount } = createContext({
      fixture: populatedWithEditorFixture
    });

    const getComponentA = () => getWrapper('.component').at(0);
    const getComponentB = () => getWrapper('.component').at(1);

    beforeEach(mount);

    test('link 1', () => {
      expect(
        getComponentA()
          .find('.fixture')
          .at(0)
          .prop('href')
      ).toEqual('?editor=true&component=ComponentA&fixture=foo');
    });

    test('link 2', () => {
      expect(
        getComponentA()
          .find('.fixture')
          .at(1)
          .prop('href')
      ).toEqual('?editor=true&component=ComponentA&fixture=bar');
    });

    test('link 3', () => {
      expect(
        getComponentB()
          .find('.fixture')
          .at(0)
          .prop('href')
      ).toEqual('?editor=true&component=ComponentB&fixture=baz');
    });

    test('link 4', () => {
      expect(
        getComponentB()
          .find('.fixture')
          .at(1)
          .prop('href')
      ).toEqual('?editor=true&component=ComponentB&fixture=qux');
    });
  });
});

describe('Select', () => {
  const { getWrapper, mount } = createContext({
    fixture: populatedFixture
  });

  const getComponentA = () => getWrapper('.component').at(0);
  const getComponentB = () => getWrapper('.component').at(1);

  beforeEach(mount);

  test('should call select callback on click', () => {
    const fixtureFoo = getComponentA()
      .find('.fixture')
      .at(0);
    fixtureFoo.simulate('click', {
      preventDefault: jest.fn()
    });

    expect(getWrapper().props().onUrlChange).toHaveBeenCalledWith(
      `http://foo.bar/${fixtureFoo.prop('href')}`
    );
  });

  test('should call select callback on click', () => {
    const fixtureQux = getComponentB()
      .find('.fixture')
      .at(1);
    fixtureQux.simulate('click', {
      preventDefault: jest.fn()
    });

    expect(getWrapper().props().onUrlChange).toHaveBeenCalledWith(
      `http://foo.bar/${fixtureQux.prop('href')}`
    );
  });
});

describe('Search', () => {
  const { getWrapper, mount } = createContext({
    fixture: populatedFixture
  });

  beforeEach(mount);

  test('should only show matched component', () => {
    const searchInput = getWrapper('.searchInput');
    searchInput.simulate('change', { target: { value: 'ux' } });

    // This is a mouthful, but we want to ensure that only ComponentB/qux
    // is visible
    const components = getWrapper('.component');
    const fixtures = getWrapper('.fixture');
    expect(components).toHaveLength(1);
    expect(fixtures).toHaveLength(1);
    expect(components.at(0).text()).toContain('ComponentB');
    expect(fixtures.at(0).text()).toContain('qux');
  });
});

describe('Search input keyboard shortcut', () => {
  const { getRef, getWrapper, mount } = createContext({
    fixture: populatedFixture
  });

  // Triggering a window event is cumbersome...
  const triggerKeyEvent = (handler, keyCode) => {
    handler({ keyCode, preventDefault: jest.fn() });
  };

  beforeEach(mount);

  describe('on `s` key', () => {
    beforeEach(() => {
      triggerKeyEvent(getRef().onWindowKey, 83);
    });

    test('should focus input', () => {
      expect(document.activeElement.className).toBe('searchInput');
    });
  });

  describe('on ESC key', () => {
    let searchInput;

    beforeEach(() => {
      searchInput = getWrapper('.searchInput');
      triggerKeyEvent(getRef().onWindowKey, 83);
      searchInput.simulate('change', { target: { value: 'foo' } });
      triggerKeyEvent(getRef().onWindowKey, 27);
    });

    test('should blur input', () => {
      expect(document.activeElement.className).not.toBe('searchInput');
    });

    test('should clear input', () => {
      expect(searchInput.prop('value')).toBe('');
    });
  });
});

describe('Selected fixture', () => {
  const { getWrapper, mount } = createContext({
    fixture: populatedAndSelectedFixture
  });

  beforeEach(mount);

  test('should add extra class to selected fixture', () => {
    expect(getWrapper('.fixtureSelected').length).toEqual(1);
    expect(getWrapper('.fixtureSelected').text()).toContain('bar');
  });
});
