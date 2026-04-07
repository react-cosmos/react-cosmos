import {
  FixtureList,
  FixtureListItem,
} from '../../userModules/fixtureTypes.js';
import { addTreeNodeChild } from '../../utils/tree.js';
import { removeFixtureNameExtension } from '../fixtureUtils.js';
import { FixtureTreeNode } from '../types.js';

export function createRawFixtureTree(fixtures: FixtureList): FixtureTreeNode {
  const rootNode: FixtureTreeNode = {
    data: { type: 'fileDir' },
  };

  Object.keys(fixtures).forEach(fixturePath =>
    addFixturePathToTree(rootNode, fixturePath, fixtures[fixturePath])
  );

  return rootNode;
}

function addFixturePathToTree(
  rootNode: FixtureTreeNode,
  fixturePath: string,
  fixtureItem: FixtureListItem
) {
  const { parents, fileName } = parseFixturePath(fixturePath);

  if (fixtureItem.type == 'single') {
    injectNode(rootNode, parents, fileName, {
      data: {
        type: 'fixture',
        path: fixturePath,
      },
    });
  } else if (fixtureItem.type == 'multi') {
    injectNode(rootNode, parents, fileName, {
      data: {
        type: 'multiFixture',
        path: fixturePath,
        names: fixtureItem.fixtureNames,
      },
    });
  }
}

function parseFixturePath(fixturePath: string) {
  const parents = fixturePath.split('/');

  const rawFixtureName = parents.pop();
  if (!rawFixtureName) throw new Error('Fixture name is empty');

  return {
    parents,
    fileName: removeFixtureNameExtension(rawFixtureName),
  };
}

function injectNode(
  rootNode: FixtureTreeNode,
  parents: string[],
  childName: string,
  childNode: FixtureTreeNode
) {
  if (parents.length === 0)
    return addTreeNodeChild(rootNode, childName, childNode);

  let curParent = rootNode;
  for (const parentName of parents) {
    if (!curParent.children) curParent.children = {};
    if (!curParent.children[parentName]) {
      curParent.children[parentName] = { data: { type: 'fileDir' } };
    }
    curParent = curParent.children[parentName];
  }

  addTreeNodeChild(curParent, childName, childNode);
}
