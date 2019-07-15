import { get, set } from 'lodash';
import { FixtureId, FixtureNamesByPath } from 'react-cosmos-shared2/renderer';
import { FixtureNode } from './shared';

export function createFixtureTree(fixtures: FixtureNamesByPath): FixtureNode {
  const rootNode = getBlankNode();
  Object.keys(fixtures).forEach(fixturePath =>
    addFixturePathToTree(rootNode, fixturePath, fixtures[fixturePath])
  );

  return rootNode;
}

function getBlankNode(): FixtureNode {
  return {
    items: {},
    dirs: {}
  };
}

function addFixturePathToTree(
  rootNode: FixtureNode,
  fixturePath: string,
  fixtureNames: null | string[]
) {
  const namespace = fixturePath.split('/');
  const rawFixtureName = namespace.pop();
  if (!rawFixtureName) {
    throw new Error('Fixture name is empty');
  }

  const fileName = removeFixtureNameExtension(rawFixtureName);

  if (!fixtureNames) {
    return addFixtureIdToTree(rootNode, namespace, fileName, {
      path: fixturePath,
      name: null
    });
  }

  fixtureNames.forEach(fixtureName => {
    addFixtureIdToTree(rootNode, [...namespace, fileName], fixtureName, {
      path: fixturePath,
      name: fixtureName
    });
  });
}

function addFixtureIdToTree(
  rootNode: FixtureNode,
  namespace: string[],
  nodeName: string,
  fixtureId: FixtureId
) {
  if (namespace.length === 0) {
    rootNode.items[nodeName] = fixtureId;
    return;
  }

  let curNodeDepth = 1;
  let curNode: FixtureNode;
  do {
    const partialNamespace = namespace.slice(0, curNodeDepth);
    const partialPath = partialNamespace.map(p => `dirs["${p}"]`).join('.');

    curNode = get(rootNode, partialPath);
    if (!curNode) {
      curNode = getBlankNode();
      set(rootNode, partialPath, curNode);
    }

    curNodeDepth += 1;
  } while (curNodeDepth <= namespace.length);

  curNode.items[nodeName] = fixtureId;
}

function removeFixtureNameExtension(fixtureName: string) {
  return fixtureName.replace(/\.(j|t)sx?$/, '');
}
