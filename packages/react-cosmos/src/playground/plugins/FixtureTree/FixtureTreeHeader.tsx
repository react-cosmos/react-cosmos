import React, { useMemo } from 'react';
import styled from 'styled-components';
import { createFixtureTree } from '../../../core/fixtureTree/createFixtureTree';
import { FixtureList } from '../../../renderer/types';
import { IconButton32 } from '../../components/buttons';
import { MinusSquareIcon, PlusSquareIcon } from '../../components/icons';
import {
  getFullTreeExpansion,
  hasExpandableNodes,
  isTreeFullyCollapsed,
  TreeExpansion,
} from '../../shared/treeExpansion';
import { grey128, grey32, white10 } from '../../style/colors';

type Props = {
  fixturesDir: string;
  fixtureFileSuffix: string;
  fixtures: FixtureList;
  expansion: TreeExpansion;
  setExpansion: (treeExpansion: TreeExpansion) => unknown;
};

export function FixtureTreeHeader({
  fixturesDir,
  fixtureFileSuffix,
  fixtures,
  expansion,
  setExpansion,
}: Props) {
  const rootNode = useMemo(
    () => createFixtureTree({ fixtures, fixturesDir, fixtureFileSuffix }),
    [fixtures, fixturesDir, fixtureFileSuffix]
  );

  return (
    <Container>
      <Title>All fixtures</Title>
      {!hasExpandableNodes(rootNode) ? (
        <IconButton32
          title="Collapse all fixture tree folders"
          icon={<MinusSquareIcon />}
          disabled
          onClick={() => {}}
        />
      ) : isTreeFullyCollapsed(expansion) ? (
        <IconButton32
          title="Expand all fixture tree folders"
          icon={<PlusSquareIcon />}
          onClick={() => setExpansion(getFullTreeExpansion(rootNode))}
        />
      ) : (
        <IconButton32
          title="Collapse all fixture tree folders"
          icon={<MinusSquareIcon />}
          onClick={() => setExpansion({})}
        />
      )}
    </Container>
  );
}

const Container = styled.div`
  flex-shrink: 0;
  height: 40px;
  padding: 0 4px;
  border-top: 1px solid ${white10};
  background: ${grey32};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.div`
  padding: 0 4px 0 20px;
  color: ${grey128};
  line-height: 24px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  text-transform: uppercase;
`;
