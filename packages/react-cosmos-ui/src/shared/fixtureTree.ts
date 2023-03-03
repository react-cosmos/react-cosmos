import { isEqual } from 'lodash';
import {
  FixtureId,
  FixtureTreeNode,
  MultiFixtureTreeNodeData,
} from 'react-cosmos-core';

export function multiFixtureContainsFixtureId(
  { fixturePath, fixtureIds }: MultiFixtureTreeNodeData,
  fixtureId: FixtureId
) {
  return (
    (fixtureId.path === fixturePath && fixtureId.name === undefined) ||
    Object.keys(fixtureIds).some(fixtureName =>
      isEqual(fixtureIds[fixtureName], fixtureId)
    )
  );
}

export function nodeContainsFixtureId(
  { data, children }: FixtureTreeNode,
  fixtureId: FixtureId
): boolean {
  if (data.type === 'fixture') {
    return data.fixtureId.path === fixtureId.path;
  }

  if (data.type === 'multiFixture') {
    return multiFixtureContainsFixtureId(data, fixtureId);
  }

  return (
    children !== undefined &&
    Object.keys(children).some(childName =>
      nodeContainsFixtureId(children[childName], fixtureId)
    )
  );
}
