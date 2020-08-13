import { get, set } from 'lodash';
import { FixtureId, FixtureNamesByPath } from '../../renderer';
import { addTreeNodeChild } from '../../util';
import { FixtureTreeNode } from '../shared/types';

export function createRawFixtureTree(
  fixtures: FixtureNamesByPath
): FixtureTreeNode {
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
  fixtureNames: null | string[]
) {
  const parents = fixturePath.split('/');
  const rawFixtureName = parents.pop();
  if (!rawFixtureName) throw new Error('Fixture name is empty');
  const fileName = removeFixtureNameExtension(rawFixtureName);

  if (!fixtureNames)
    return injectFixtureId(rootNode, parents, fileName, {
      path: fixturePath,
      name: null,
    });

  injectFixtureTreeNode(rootNode, parents, fileName, {
    data: { type: 'multiFixture' },
  });
  fixtureNames.forEach(fixtureName => {
    injectFixtureId(rootNode, [...parents, fileName], fixtureName, {
      path: fixturePath,
      name: fixtureName,
    });
  });
}

function injectFixtureId(
  rootNode: FixtureTreeNode,
  parents: string[],
  childName: string,
  fixtureId: FixtureId
) {
  injectFixtureTreeNode(rootNode, parents, childName, {
    data: {
      type: 'fixture',
      fixtureId: fixtureId,
    },
  });
}

function injectFixtureTreeNode(
  rootNode: FixtureTreeNode,
  parents: string[],
  childName: string,
  childNode: FixtureTreeNode
) {
  if (parents.length === 0)
    return addTreeNodeChild(rootNode, childName, childNode);

  let curParentDepth = 1;
  let curParent: FixtureTreeNode;
  do {
    const curParents = parents.slice(0, curParentDepth);
    const curPath = curParents.map(p => `children["${p}"]`).join('.');

    curParent = get(rootNode, curPath);
    if (!curParent) {
      curParent = {
        data: { type: 'fileDir' },
      };
      set(rootNode, curPath, curParent);
    }

    curParentDepth += 1;
  } while (curParentDepth <= parents.length);

  addTreeNodeChild(curParent, childName, childNode);
}

function removeFixtureNameExtension(fixtureName: string) {
  return fixtureName.replace(/\.(j|t)sx?$/, '');
}
