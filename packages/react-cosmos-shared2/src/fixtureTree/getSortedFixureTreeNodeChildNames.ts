import { FixtureTreeNode } from './shared/types';

export function getSortedFixureTreeNodeChildNames(
  node: FixtureTreeNode
): string[] {
  const { data, children } = node;
  if (data.type === 'fixture' || !children) return [];

  // Original fixture order is preserved in multi fixtures
  const childNames = Object.keys(children);
  if (data.type === 'multiFixture') return childNames;

  const dirChildNames = childNames.filter(
    childName => children[childName].data.type === 'fileDir'
  );
  const fixtureChildNames = childNames.filter(
    childName => children[childName].data.type !== 'fileDir'
  );

  // Group per dirs vs fixture & multi fuxtures, and sort alphabetically within
  // each group
  return [...dirChildNames.sort(), ...fixtureChildNames.sort()];
}
