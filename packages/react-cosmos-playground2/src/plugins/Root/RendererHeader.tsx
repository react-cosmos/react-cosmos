import { isEqual } from 'lodash';
import React from 'react';
import { TreeNode } from 'react-cosmos-shared2/fixtureTree';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import styled from 'styled-components';
import {
  MenuIcon,
  RefreshCwIcon,
  SlidersIcon,
  XCircleIcon,
} from '../../shared/icons';
import { RendererActionSlot } from '../../shared/slots/RendererActionSlot';
import { IconButton32 } from '../../shared/ui/buttons';
import { grey176, grey32, white10 } from '../../shared/ui/colors';

type Props = {
  fixtureTree: TreeNode<FixtureId>;
  fixtureId: FixtureId;
  navOpen: boolean;
  panelOpen: boolean;
  rendererActionOrder: string[];
  onOpenNav: () => unknown;
  onTogglePanel: () => unknown;
  onFixtureSelect: (fixtureId: FixtureId) => unknown;
  onClose: () => unknown;
};

export const RendererHeader = React.memo(function RendererHeader({
  fixtureTree,
  fixtureId,
  navOpen,
  panelOpen,
  rendererActionOrder,
  onOpenNav,
  onTogglePanel,
  onFixtureSelect,
  onClose,
}: Props) {
  const fixturePath = React.useMemo(
    () => getFixtureTreePath(fixtureTree, fixtureId),
    [fixtureTree, fixtureId]
  );
  const slotProps = React.useMemo(() => ({ fixtureId }), [fixtureId]);
  const onReload = React.useCallback(() => onFixtureSelect(fixtureId), [
    fixtureId,
    onFixtureSelect,
  ]);

  return (
    <Container>
      <Left>
        {!navOpen && (
          <>
            <IconButton32
              icon={<MenuIcon />}
              title="Show fixture list"
              selected={false}
              onClick={onOpenNav}
            />
            <ButtonSeparator />
          </>
        )}
        <IconButton32
          icon={<XCircleIcon />}
          title="Close fixture"
          onClick={onClose}
        />
        <IconButton32
          icon={<RefreshCwIcon />}
          title="Reload fixture"
          onClick={onReload}
        />
      </Left>
      {fixturePath !== null && (
        <FixtureName>{fixturePath.join(' ')}</FixtureName>
      )}
      <Right>
        <RendererActionSlot
          slotProps={slotProps}
          plugOrder={rendererActionOrder}
        />
        <IconButton32
          icon={<SlidersIcon />}
          title="Toggle control panel"
          selected={panelOpen}
          onClick={onTogglePanel}
        />
      </Right>
    </Container>
  );
});

function getFixtureTreePath(
  fixtureTree: TreeNode<FixtureId>,
  fixtureId: FixtureId,
  parents: string[] = []
): string[] | null {
  const { items, dirs } = fixtureTree;

  const itemNames = Object.keys(items);
  for (let itemName of itemNames) {
    if (isEqual(items[itemName], fixtureId)) {
      return [...parents, itemName];
    }
  }

  const dirNames = Object.keys(dirs);
  for (let dirName of dirNames) {
    const dirParents = [...parents, dirName];
    const foundPath = getFixtureTreePath(dirs[dirName], fixtureId, dirParents);
    if (foundPath) {
      return foundPath;
    }
  }

  return null;
}

const Container = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  padding: 0 4px;
  border-bottom: 1px solid ${white10};
  background: ${grey32};
  white-space: nowrap;
  overflow-x: auto;
`;

const Actions = styled.div`
  > button {
    margin-left: 4px;

    :first-child {
      margin-left: 0;
    }
  }
`;

const Left = styled(Actions)`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Right = styled(Actions)`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const ButtonSeparator = styled.div`
  flex-shrink: 0;
  background: ${white10};
  width: 1px;
  height: 40px;
  margin-left: 4px;
`;

const FixtureName = styled.div`
  margin: 0 32px;
  padding: 4px 0;
  color: ${grey176};
  line-height: 24px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;
