import TreeService, {
  mapFixturestoPathsValues,
  buildTreeFromState,
  buildTree,
  updateTree,
  selectPath,
  selectPaths,
  deselectPath,
  deselectPaths,
  togglePath
} from '../service';

import { data as fixtures } from '../__fixtures__/tree';

import {
  PATH_TO_FOO,
  PATH_TO_BAZ,
  PATH_TO_TAR_INDEX,
  initialTreeFromFixtures,
  treeFromFirstPath,
  initialPathsOutput,
  treeWtihFooSelected,
  treeWtihTarSelected,
  treeWtihBazClosed,
  treeWtihTarAndFooSelected,
  updatedTreeFromFirstPath,
  fooPaths
} from './constants';

/* global describe test expect beforeAll */

describe('Tree Service Unit Tests', () => {
  test('should convert fixtures to paths', () => {
    expect(mapFixturestoPathsValues(fixtures)).toEqual(initialPathsOutput);
  });

  test('should return empty paths if fixtures is undefined', () => {
    expect(mapFixturestoPathsValues()).toEqual({});
  });

  test('should return undefined if no path', () => {
    expect(buildTree({}, [''])).toBe(undefined);
  });

  test('should build tree from first path', () => {
    expect(
      buildTree(
        { paths: initialPathsOutput },
        Object.keys(initialPathsOutput)[0].split('/')
      )
    ).toEqual(treeFromFirstPath);
  });

  test('should buildTreeFromState', () => {
    expect(buildTreeFromState({ tree: {}, paths: initialPathsOutput })).toEqual(
      initialTreeFromFixtures
    );
  });

  test('should throw an error for accessing incorrect path paths in tree', () => {
    try {
      selectPath(treeFromFirstPath, PATH_TO_BAZ);
    } catch (err) {
      expect(err.message).toEqual(
        `path ${PATH_TO_BAZ} does not exist in Tree starting Baz`
      );
    }
  });

  test('should select paths in tree', () => {
    expect(selectPath(initialTreeFromFixtures, PATH_TO_FOO)).toEqual(
      treeWtihFooSelected
    );
  });

  test('should deselect path in tree', () => {
    expect(deselectPath(treeWtihFooSelected, PATH_TO_FOO)).toEqual(
      initialTreeFromFixtures
    );
  });

  test('should deselect paths in tree', () => {
    expect(
      deselectPaths(treeWtihTarAndFooSelected, [PATH_TO_FOO, PATH_TO_TAR_INDEX])
    ).toEqual(initialTreeFromFixtures);
  });

  test('should select paths in tree', () => {
    expect(
      selectPaths(initialTreeFromFixtures, [PATH_TO_FOO, PATH_TO_TAR_INDEX])
    ).toEqual(treeWtihTarAndFooSelected);
  });

  test('should toggle closed', () => {
    expect(togglePath(initialTreeFromFixtures, PATH_TO_BAZ)).toEqual(
      treeWtihBazClosed
    );
  });

  test('should toggle open', () => {
    expect(togglePath(treeWtihBazClosed, PATH_TO_BAZ)).toEqual(
      initialTreeFromFixtures
    );
  });

  test('should update tree', () => {
    expect(updateTree(treeWtihFooSelected, treeWtihTarSelected)).toEqual(
      treeWtihTarAndFooSelected
    );
  });

  test('should update tree agressivly', () => {
    const onlyNew = true;
    expect(updateTree(treeWtihFooSelected, treeFromFirstPath, onlyNew)).toEqual(
      updatedTreeFromFirstPath
    );
  });

  test('should update non existent tree', () => {
    expect(updateTree(undefined, treeFromFirstPath)).toEqual(treeFromFirstPath);
  });
});

describe('Tree Service', () => {
  let Tree;

  beforeAll(() => {
    Tree = new TreeService({ selected: [PATH_TO_FOO], fixtures });
  });

  test('Should Create a tree from fixtures and foo selected', () => {
    const { tree } = Tree.getState();
    expect(tree).toEqual(treeWtihFooSelected);
  });

  test('should rebuild tree from Paths', () => {
    Tree.rebuildFromPaths(fooPaths);
    const { tree } = Tree.getState();
    expect(tree).toEqual(treeFromFirstPath);
  });

  test('Should rebuild a tree from fixtures', () => {
    Tree.rebuildFromFixtures(fixtures);
    const { tree } = Tree.getState();
    expect(tree).toEqual(initialTreeFromFixtures);
  });

  test('Should select foo path', () => {
    Tree.select(PATH_TO_FOO);
    const { tree } = Tree.getState();
    expect(tree).toEqual(treeWtihFooSelected);
  });

  test('Should select Tar/index path deselecting foo', () => {
    Tree.select(PATH_TO_TAR_INDEX);
    const { tree, selected } = Tree.getState();
    expect(selected).toEqual([PATH_TO_TAR_INDEX]);
    expect(tree).toEqual(treeWtihTarSelected);
  });

  test('Should select foo as well if Tar/index is alrady selected', () => {
    const multiple = true;
    Tree.select(PATH_TO_FOO, multiple);
    const { tree, selected } = Tree.getState();
    expect(selected).toEqual([PATH_TO_TAR_INDEX, PATH_TO_FOO]);
    expect(tree).toEqual(treeWtihTarAndFooSelected);
  });

  test('Should deselect path if already selected', () => {
    const multiple = true;

    Tree.select(PATH_TO_FOO, multiple);

    let { tree, selected } = Tree.getState();
    expect(selected).toEqual([PATH_TO_TAR_INDEX]);
    expect(tree).toEqual(treeWtihTarSelected);

    Tree.select(PATH_TO_TAR_INDEX, multiple);
    ({ tree, selected } = Tree.getState());
    expect(selected).toEqual([]);
    expect(tree).toEqual(initialTreeFromFixtures);
  });

  test('Should toggle Baz to closed state', () => {
    Tree.toggleOpen(PATH_TO_BAZ);
    const { tree } = Tree.getState();
    expect(tree).toEqual(treeWtihBazClosed);
  });

  test('Should toggle Baz to open state', () => {
    Tree.toggleOpen(PATH_TO_BAZ);
    const { tree } = Tree.getState();
    expect(tree).toEqual(initialTreeFromFixtures);
  });

  test('should update tree', () => {
    Tree.update(treeWtihFooSelected);
    let { tree } = Tree.getState();
    expect(tree).toEqual(treeWtihFooSelected);
    const onlyKeepUpdatedBranches = true;
    Tree.update(treeFromFirstPath, onlyKeepUpdatedBranches);
    ({ tree } = Tree.getState());
    expect(tree).toEqual(updatedTreeFromFirstPath);
  });
});
