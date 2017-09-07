import React from 'react';
import { shallow, mount } from 'enzyme';
import renderer from 'react-test-renderer';
import FixtureList from '../index';
import populatedFixture from '../__fixtures__/populated';
import populatedAndSelectedFixture from '../__fixtures__/populated-and-selected';

describe('Tree Fixtrue View', () => {
  test('should load Tree with propulated items ', () => {
    const list = renderer
      .create(<FixtureList {...populatedFixture.props} />)
      .toJSON();
    expect(list).toMatchSnapshot();
  });

  test('should load Tree with propulated items and selected path', () => {
    const list = renderer
      .create(<FixtureList {...populatedAndSelectedFixture.props} />)
      .toJSON();
    expect(list).toMatchSnapshot();
  });

  test.only('should have state set correctly', () => {
    const wrapper = shallow(
      <FixtureList {...populatedAndSelectedFixture.props} />
    );
    const instance = wrapper.instance();
    expect(instance.state.selectedPath).toEqual('ComponentA/bar');
    expect(instance.state.filteredFixtures).toEqual(
      populatedAndSelectedFixture.fixtures
    );
  });
});

// describe('Select', () => {
//   let wrapper;
//   let onUrlChange;

//   beforeEach(() => {
//     onUrlChange = jest.fn();
//     wrapper = shallow(<FixtureList {...populatedFixture.props} onUrlChange={onUrlChange} />);
//   });

//   test.only('should call select callback on click', () => {
//     const leaf = wrapper.find('.isLeaf');
//     leaf.simulate('click');
//     expect(onUrlChange.mock.calls.length).toEqual(1);
//     console.log(onUrlChange.mock.calls[0]);
//   });
// });

// describe('Search', () => {
//   let wrapper;
//   let searchInput;

//   beforeEach(() => {
//     wrapper = mount(<FixtureList {...populatedFixture.props} />);
//     searchInput = wrapper.find('.searchInput');
//   });

//   test('should only show matched component', () => {
//     searchInput.simulate('change', { target: { value: 'ux' } });
//     const instance = wrapper.instance();
//     expect(instance.state.searchText).toEqal('ux');
//     expect(instance.state.filteredFixtures).toEqal({
//       ComponentB: ['qux']
//     });
//   });
// });

describe('Search input keyboard shortcut', () => {
  let wrapper;
  let instance;

  // Triggering a window event is cumbersome...
  const triggerKeyEvent = (handler, keyCode) => {
    handler({ keyCode, preventDefault: jest.fn() });
  };

  beforeEach(() => {
    wrapper = mount(<FixtureList {...populatedFixture.props} />);
    instance = wrapper.instance();
  });

  describe('on `s` key', () => {
    let searchInput;

    beforeEach(() => {
      searchInput = wrapper.find('.searchInput');
      triggerKeyEvent(instance.onWindowKey, 83);
    });

    test('should focus input', () => {
      expect(searchInput.node).toBe(document.activeElement);
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
      expect(searchInput.node).not.toBe(document.activeElement);
    });

    test('should clear input', () => {
      expect(searchInput.prop('value')).toBe('');
    });
  });
});
