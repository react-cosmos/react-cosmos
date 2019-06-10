import React from 'react';
import { TreeRowContainer, ValueNode } from './shared';

type Props = {
  node: ValueNode;
  parents: string[];
  onToggle: () => unknown;
};

export function ValueInputTreeDir({ node, parents, onToggle }: Props) {
  const dirName = parents[parents.length - 1];
  const childNames = getChildNames(node);
  return (
    <TreeRowContainer style={{ paddingLeft: (parents.length - 1) * 16 }}>
      <button disabled={childNames.length === 0} onClick={onToggle}>
        {dirName}
        {childNames.length > 0 ? ` { ${childNames.join(', ')} }` : '{}'}
      </button>
    </TreeRowContainer>
  );
}

function getChildNames(node: ValueNode): string[] {
  const { dirs, items } = node;
  return [...Object.keys(dirs), ...Object.keys(items)];
}
