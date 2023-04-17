import { FixtureId, FixtureTreeNode } from 'react-cosmos-core';

export function fixtureTreeNodeContainsFixtureId(
  { data, children }: FixtureTreeNode,
  fixtureId: FixtureId
): boolean {
  if (data.type === 'fixture' || data.type === 'multiFixture') {
    return data.path === fixtureId.path;
  }

  return (
    children !== undefined &&
    Object.keys(children).some(childName =>
      fixtureTreeNodeContainsFixtureId(children[childName], fixtureId)
    )
  );
}
