import React from 'react';
import { RowContainer, ValueNode } from './shared';

type Props = {
  node: ValueNode;
  parents: string[];
  onToggle: () => unknown;
};

export function ValueInputTreeDir({ node, parents, onToggle }: Props) {
  const { dirs, items } = node;
  const childNames = [...Object.keys(dirs), ...Object.keys(items)];
  return (
    <RowContainer style={{ paddingLeft: (parents.length - 1) * 16 }}>
      <button disabled={childNames.length === 0} onClick={onToggle}>
        {parents[parents.length - 1]}
        {childNames.length > 0 ? ` { ${childNames.join(', ')} }` : '{}'}
      </button>
    </RowContainer>
  );
}
