import React from 'react';
import { shallow, mount } from 'enzyme';
import FixtureList from '../';

const fixtures = {
  ComponentA: ['foo', 'bar'],
  ComponentB: ['baz', 'qux'],
};

describe('List', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <FixtureList fixtures={fixtures} urlParams={{}} onUrlChange={() => {}}/>
    );
  });

  test('should render component names', () => {
    const componentA = wrapper.find('.component').at(0);
    expect(componentA.text()).toContain('ComponentA');

    const componentB = wrapper.find('.component').at(1);
    expect(componentB.text()).toContain('ComponentB');
  });

  test('should render fixture names', () => {
    const componentA = wrapper.find('.component').at(0);
    expect(componentA.find('.fixture').at(0).text()).toContain('foo');
    expect(componentA.find('.fixture').at(1).text()).toContain('bar');

    const componentB = wrapper.find('.component').at(1);
    expect(componentB.find('.fixture').at(0).text()).toContain('baz');
    expect(componentB.find('.fixture').at(1).text()).toContain('qux');
  });
});

describe('Links', () => {
  let urlParams;
  let wrapper;
  let componentA;
  let componentB;

  beforeEach(() => {
    wrapper = shallow(
      <FixtureList fixtures={fixtures} urlParams={urlParams} onUrlChange={() => {}}/>
    );
    componentA = wrapper.find('.component').at(0);
    componentB = wrapper.find('.component').at(1);
  });

  describe('editor closed', () => {
    beforeAll(() => {
      urlParams = {};
    });

    test('link 1', () => {
      expect(componentA.find('.fixture').at(0).prop('href'))
        .toEqual('?component=ComponentA&fixture=foo');
    });

    test('link 2', () => {
      expect(componentA.find('.fixture').at(1).prop('href'))
        .toEqual('?component=ComponentA&fixture=bar');
    });

    test('link 3', () => {
      expect(componentB.find('.fixture').at(0).prop('href'))
        .toEqual('?component=ComponentB&fixture=baz');
    });

    test('link 4', () => {
      expect(componentB.find('.fixture').at(1).prop('href'))
        .toEqual('?component=ComponentB&fixture=qux');
    });
  });

  describe('editor open', () => {
    beforeAll(() => {
      urlParams = { editor: true };
    });

    test('link 1', () => {
      expect(componentA.find('.fixture').at(0).prop('href'))
        .toEqual('?editor=true&component=ComponentA&fixture=foo');
    });

    test('link 2', () => {
      expect(componentA.find('.fixture').at(1).prop('href'))
        .toEqual('?editor=true&component=ComponentA&fixture=bar');
    });

    test('link 3', () => {
      expect(componentB.find('.fixture').at(0).prop('href'))
        .toEqual('?editor=true&component=ComponentB&fixture=baz');
    });

    test('link 4', () => {
      expect(componentB.find('.fixture').at(1).prop('href'))
        .toEqual('?editor=true&component=ComponentB&fixture=qux');
    });
  });
});

describe('Select', () => {
  let wrapper;
  let onUrlChange;

  beforeEach(() => {
    onUrlChange = jest.fn();
    wrapper = shallow(
      <FixtureList fixtures={fixtures} urlParams={{}} onUrlChange={onUrlChange}/>
    );
  });

  test('should call select callback on click', () => {
    const componentA = wrapper.find('.component').at(0);
    const fixtureFoo = componentA.find('.fixture').at(0);
    fixtureFoo.simulate('click', {
      preventDefault: jest.fn(),
      currentTarget: {
        href: fixtureFoo.prop('href')
      }
    });

    expect(onUrlChange).toHaveBeenCalledWith(fixtureFoo.prop('href'));
  });

  test('should call select callback on click', () => {
    const componentB = wrapper.find('.component').at(1);
    const fixtureQux = componentB.find('.fixture').at(1);
    fixtureQux.simulate('click', {
      preventDefault: jest.fn(),
      currentTarget: {
        href: fixtureQux.prop('href')
      }
    });

    expect(onUrlChange).toHaveBeenCalledWith(fixtureQux.prop('href'));
  });
});

describe('Search', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <FixtureList fixtures={fixtures} urlParams={{}} onUrlChange={() => {}}/>
    );
  });

  test('should only show matched component', () => {
    const searchInput = wrapper.find('.searchInput');
    searchInput.simulate('change', { target: { value: 'ux' }});

    // This is a mouthful, but we want to ensure that only ComponentB/qux
    // is visible
    const components = wrapper.find('.component');
    const fixtures = wrapper.find('.fixture');
    expect(components.length).toBe(1);
    expect(fixtures.length).toBe(1);
    expect(components.at(0).text()).toContain('ComponentB');
    expect(fixtures.at(0).text()).toContain('qux');
  });
});

describe('Search input keyboard shortcut', () => {
  let wrapper;

  // Triggering a window event is cumbersome...
  const triggerKeyEvent = (handler, keyCode) => {
    handler({ keyCode, preventDefault: jest.fn() });
  };

  beforeEach(() => {
    wrapper = mount(
      <FixtureList fixtures={fixtures} urlParams={{}} onUrlChange={() => {}}/>
    );
  });

  describe('on `s` key', () => {
    let searchInput;

    beforeEach(() => {
      searchInput = wrapper.find('.searchInput');
      triggerKeyEvent(wrapper.instance().onWindowKey, 83);
    });

    test('should focus input', () => {
      expect(searchInput.node).toBe(document.activeElement);
    });
  });

  describe('on ESC key', () => {
    let searchInput;

    beforeEach(() => {
      searchInput = wrapper.find('.searchInput');
      triggerKeyEvent(wrapper.instance().onWindowKey, 83);
      searchInput.simulate('change', { target: { value: 'foo' }});
      triggerKeyEvent(wrapper.instance().onWindowKey, 27);
    });

    test('should blur input', () => {
      expect(searchInput.node).not.toBe(document.activeElement);
    });

    test('should clear input', () => {
      expect(searchInput.prop('value')).toBe('');
    });
  });
});

describe('Selected fixture', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(
      <FixtureList
        fixtures={fixtures}
        selectedComponent="ComponentA"
        selectedFixture="bar"
        urlParams={{}}
        onUrlChange={() => {}}
        />
    );
  });

  test('should add extra class to selected fixture', () => {
    expect(wrapper.find('.fixtureSelected').length).toEqual(1);
    expect(wrapper.find('.fixtureSelected').text()).toContain('bar');
  });
});
