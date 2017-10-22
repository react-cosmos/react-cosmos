import React from 'react';
import merge from 'lodash.merge';
import { mount } from 'enzyme';
import { Loader } from 'react-cosmos-loader';
import FixtureList from '../';
import populatedFixture from '../__fixtures__/populated';
import populatedWithEditorFixture from '../__fixtures__/populated-with-editor';
import populatedAndSelectedFixture from '../__fixtures__/populated-and-selected';

function afterOngoingPromises() {
  return new Promise(resolve => {
    setImmediate(resolve);
  });
}

describe('List', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(
      <Loader component={FixtureList} fixture={populatedFixture} />
    );
    return afterOngoingPromises();
  });

  test('should render component names', () => {
    const componentA = wrapper.find('.component').at(0);
    expect(componentA.text()).toContain('ComponentA');

    const componentB = wrapper.find('.component').at(1);
    expect(componentB.text()).toContain('ComponentB');
  });

  test('should render fixture names', () => {
    const componentA = wrapper.find('.component').at(0);
    expect(
      componentA
        .find('.fixture')
        .at(0)
        .text()
    ).toContain('foo');
    expect(
      componentA
        .find('.fixture')
        .at(1)
        .text()
    ).toContain('bar');

    const componentB = wrapper.find('.component').at(1);
    expect(
      componentB
        .find('.fixture')
        .at(0)
        .text()
    ).toContain('baz');
    expect(
      componentB
        .find('.fixture')
        .at(1)
        .text()
    ).toContain('qux');
  });
});

describe('Links', () => {
  let wrapper;
  let componentA;
  let componentB;

  describe('editor closed', () => {
    beforeEach(() => {
      wrapper = mount(
        <Loader component={FixtureList} fixture={populatedFixture} />
      );
      componentA = wrapper.find('.component').at(0);
      componentB = wrapper.find('.component').at(1);
    });

    test('link 1', () => {
      expect(
        componentA
          .find('.fixture')
          .at(0)
          .prop('href')
      ).toEqual('?component=ComponentA&fixture=foo');
    });

    test('link 2', () => {
      expect(
        componentA
          .find('.fixture')
          .at(1)
          .prop('href')
      ).toEqual('?component=ComponentA&fixture=bar');
    });

    test('link 3', () => {
      expect(
        componentB
          .find('.fixture')
          .at(0)
          .prop('href')
      ).toEqual('?component=ComponentB&fixture=baz');
    });

    test('link 4', () => {
      expect(
        componentB
          .find('.fixture')
          .at(1)
          .prop('href')
      ).toEqual('?component=ComponentB&fixture=qux');
    });
  });

  describe('editor open', () => {
    beforeEach(() => {
      wrapper = mount(
        <Loader component={FixtureList} fixture={populatedWithEditorFixture} />
      );
      componentA = wrapper.find('.component').at(0);
      componentB = wrapper.find('.component').at(1);
    });

    test('link 1', () => {
      expect(
        componentA
          .find('.fixture')
          .at(0)
          .prop('href')
      ).toEqual('?editor=true&component=ComponentA&fixture=foo');
    });

    test('link 2', () => {
      expect(
        componentA
          .find('.fixture')
          .at(1)
          .prop('href')
      ).toEqual('?editor=true&component=ComponentA&fixture=bar');
    });

    test('link 3', () => {
      expect(
        componentB
          .find('.fixture')
          .at(0)
          .prop('href')
      ).toEqual('?editor=true&component=ComponentB&fixture=baz');
    });

    test('link 4', () => {
      expect(
        componentB
          .find('.fixture')
          .at(1)
          .prop('href')
      ).toEqual('?editor=true&component=ComponentB&fixture=qux');
    });
  });
});

describe('Select', () => {
  let wrapper;
  let onUrlChange;

  beforeEach(() => {
    onUrlChange = jest.fn();
    const fixture = merge({}, populatedFixture, {
      props: {
        onUrlChange
      }
    });
    wrapper = mount(<Loader component={FixtureList} fixture={fixture} />);
  });

  test('should call select callback on click', () => {
    const componentA = wrapper.find('.component').at(0);
    const fixtureFoo = componentA.find('.fixture').at(0);
    fixtureFoo.simulate('click', {
      preventDefault: jest.fn()
    });

    expect(onUrlChange).toHaveBeenCalledWith(
      `http://foo.bar/${fixtureFoo.prop('href')}`
    );
  });

  test('should call select callback on click', () => {
    const componentB = wrapper.find('.component').at(1);
    const fixtureQux = componentB.find('.fixture').at(1);
    fixtureQux.simulate('click', {
      preventDefault: jest.fn()
    });

    expect(onUrlChange).toHaveBeenCalledWith(
      `http://foo.bar/${fixtureQux.prop('href')}`
    );
  });
});

describe('Search', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(
      <Loader component={FixtureList} fixture={populatedFixture} />
    );
  });

  test('should only show matched component', () => {
    const searchInput = wrapper.find('.searchInput');
    searchInput.simulate('change', { target: { value: 'ux' } });

    // This is a mouthful, but we want to ensure that only ComponentB/qux
    // is visible
    const components = wrapper.find('.component');
    const fixtures = wrapper.find('.fixture');
    expect(components).toHaveLength(1);
    expect(fixtures).toHaveLength(1);
    expect(components.at(0).text()).toContain('ComponentB');
    expect(fixtures.at(0).text()).toContain('qux');
  });
});

describe('Search input keyboard shortcut', () => {
  let wrapper;
  let instance;

  // Triggering a window event is cumbersome...
  const triggerKeyEvent = (handler, keyCode) => {
    handler({ keyCode, preventDefault: jest.fn() });
  };

  beforeEach(() => {
    const waitToRender = new Promise(resolve => {
      // Mount component in order to be able to access DOM nodes
      wrapper = mount(
        <Loader
          component={FixtureList}
          fixture={populatedFixture}
          onComponentRef={i => {
            instance = i;
            resolve();
          }}
        />
      );
    });
    return waitToRender;
  });

  describe('on `s` key', () => {
    beforeEach(() => {
      triggerKeyEvent(instance.onWindowKey, 83);
      wrapper.update();
    });

    test('should focus input', () => {
      expect(document.activeElement.className).toBe('searchInput');
    });
  });

  describe('on ESC key', () => {
    let searchInput;

    beforeEach(() => {
      searchInput = wrapper.find('.searchInput');
      triggerKeyEvent(instance.onWindowKey, 83);
      searchInput.simulate('change', { target: { value: 'foo' } });
      triggerKeyEvent(instance.onWindowKey, 27);
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
  let wrapper;

  beforeEach(() => {
    wrapper = mount(
      <Loader component={FixtureList} fixture={populatedAndSelectedFixture} />
    );
  });

  test('should add extra class to selected fixture', () => {
    expect(wrapper.find('.fixtureSelected').length).toEqual(1);
    expect(wrapper.find('.fixtureSelected').text()).toContain('bar');
  });
});
