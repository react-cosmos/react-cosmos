import { createContext } from '../../../utils/enzyme';
import treeFixture from '../__fixtures__/tree';
import treeWithEditorAndFullScreenParams from '../__fixtures__/tree-with-editor-and-full-screen-params';
import treeWithSearchFixture from '../__fixtures__/tree-with-search';
import { FolderIcon, ComponentIcon } from '../../SvgIcon';

describe('Tree', () => {
  const { mount, getWrapper } = createContext({ fixture: treeFixture });

  beforeEach(mount);

  test('should render component names', () => {
    const dirA = getWrapper('.componentName').at(0);
    expect(dirA.text()).toContain('dirA');

    const component1 = getWrapper('.componentName').at(1);
    expect(component1.text()).toContain('Component1');

    const fixtureA = getWrapper('.fixture').at(0);
    expect(fixtureA.text()).toContain('fixtureA');

    const fixtureDirectory = getWrapper('.fixtureDirectory').at(0);
    expect(fixtureDirectory.text()).toContain('Some folder');
  });

  test('should render appropriate icon', () => {
    const dirA = getWrapper('.componentName').at(0);
    expect(dirA.find(FolderIcon).length).toEqual(1);

    const component1 = getWrapper('.componentName').at(1);
    expect(component1.find(ComponentIcon).length).toEqual(1);

    const fixtureA = getWrapper('.fixture').at(0);
    expect(fixtureA.find(FolderIcon).length).toEqual(0);
    expect(fixtureA.find(ComponentIcon).length).toEqual(0);

    const fixtureDirectory = getWrapper('.fixtureDirectory').at(0);
    expect(fixtureDirectory.find(FolderIcon).length).toEqual(1);
  });

  test('should indent child nodes', () => {
    const dirA = getWrapper('.componentName').get(0);
    expect(dirA.props.style.paddingLeft).toEqual(10);

    const component1 = getWrapper('.componentName').get(1);
    expect(component1.props.style.paddingLeft).toEqual(30);

    const fixtureA = getWrapper('.fixture').get(0);
    expect(fixtureA.props.style.paddingLeft).toEqual(70);

    const fixtureDirectory = getWrapper('.fixtureDirectory').get(0);
    expect(fixtureDirectory.props.style.paddingLeft).toEqual(70);
  });
});

describe('Basic Links', () => {
  const { mount, getWrapper } = createContext({ fixture: treeFixture });

  beforeEach(mount);

  test('should render fixture links', () => {
    const fixtureA = getWrapper('.fixture').at(0);
    expect(fixtureA.prop('href')).toEqual(
      '?component=dirA%2FComponent1&fixture=fixtureA'
    );
  });
});

describe('Links with URL Params', () => {
  const { mount, getWrapper } = createContext({
    fixture: treeWithEditorAndFullScreenParams
  });

  beforeEach(mount);

  test('should render fixture links', () => {
    const fixtureA = getWrapper('.fixture').at(0);
    expect(fixtureA.prop('href')).toEqual(
      '?editor=true&fullScreen=true&component=dirA%2FComponent1&fixture=fixtureA'
    );
  });
});

describe('Fixture Select', () => {
  const { mount, getWrapper } = createContext({ fixture: treeFixture });

  beforeEach(mount);

  test('should call onSelect callback on fixture click', () => {
    const fixtureA = getWrapper('.fixture').at(0);
    fixtureA.simulate('click', {
      preventDefault: jest.fn()
    });

    expect(getWrapper().props().onSelect).toHaveBeenCalledWith(
      `http://foo.bar/${fixtureA.prop('href')}`
    );
  });
});

describe('Node Select', () => {
  const { mount, getWrapper } = createContext({ fixture: treeFixture });

  beforeEach(mount);

  test('should call onToggle callback on click', () => {
    const component1 = getWrapper('.componentName').at(1);
    component1.simulate('click', {
      preventDefault: jest.fn()
    });

    expect(getWrapper().props().onToggle).toHaveBeenCalled();
  });
});

describe('Search Highlight', () => {
  const { mount, getWrapper } = createContext({
    fixture: treeWithSearchFixture
  });

  beforeEach(mount);

  test('should highlight letters "sub A"', () => {
    const highlightS = getWrapper('mark').at(0);
    expect(highlightS.text()).toContain('s');
    const highlightU = getWrapper('mark').at(1);
    expect(highlightU.text()).toContain('u');
    const highlightB = getWrapper('mark').at(2);
    expect(highlightB.text()).toContain('b');
    const highlightA = getWrapper('mark').at(3);
    expect(highlightA.text()).toContain('A');
  });
});
