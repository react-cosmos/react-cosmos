import { isEqual } from 'lodash-es';
import React from 'react';
import { FixtureId, FlatFixtureTreeItem } from 'react-cosmos-core';
import styled from 'styled-components';
import { IconButton32 } from '../../components/buttons/index.js';
import {
  MenuIcon,
  RotateCcwIcon,
  SlidersIcon,
  XCircleIcon,
} from '../../components/icons/index.js';
import { FixtureActionSlot } from '../../slots/FixtureActionSlot.js';
import { RendererActionSlot } from '../../slots/RendererActionSlot.js';
import { grey176, grey32, white10 } from '../../style/colors.js';

type Props = {
  fixtureItems: FlatFixtureTreeItem[];
  fixtureId: FixtureId;
  navOpen: boolean;
  panelOpen: boolean;
  panelsLocked: boolean;
  fixtureActionOrder: string[];
  rendererActionOrder: string[];
  onOpenNav: () => unknown;
  onTogglePanel: () => unknown;
  onReloadRenderer: () => unknown;
  onClose: () => unknown;
};
export const RendererHeader = React.memo(function RendererHeader({
  fixtureItems,
  fixtureId,
  navOpen,
  panelOpen,
  panelsLocked,
  fixtureActionOrder,
  rendererActionOrder,
  onOpenNav,
  onTogglePanel,
  onReloadRenderer,
  onClose,
}: Props) {
  const fixtureItem = findFixtureItemById(fixtureItems, fixtureId);
  const slotProps = React.useMemo(() => ({ fixtureId }), [fixtureId]);

  return (
    <Container>
      <Left>
        {(!panelsLocked || !navOpen) && (
          <IconButton32
            icon={<MenuIcon />}
            title="Show fixture list (L)"
            selected={navOpen}
            onClick={onOpenNav}
          />
        )}
        <IconButton32
          icon={<XCircleIcon />}
          title="Close fixture"
          onClick={onClose}
        />
        <IconButton32
          icon={<RotateCcwIcon />}
          title="Reload fixture (R)"
          onClick={onReloadRenderer}
        />
        {fixtureItem && (
          <FixtureActionSlotContainer
            fixtureActionOrder={fixtureActionOrder}
            fixtureItem={fixtureItem}
          />
        )}
      </Left>
      {fixtureItem && <FixtureName>{getFixtureName(fixtureItem)}</FixtureName>}
      <Right>
        <RendererActionSlot
          slotProps={slotProps}
          plugOrder={rendererActionOrder}
        />
        {(!panelsLocked || !panelOpen) && (
          <IconButton32
            icon={<SlidersIcon />}
            title="Toggle control panel (P)"
            selected={panelOpen}
            onClick={onTogglePanel}
          />
        )}
      </Right>
    </Container>
  );
});

type FixtureActionSlotContainerProps = {
  fixtureActionOrder: string[];
  fixtureItem: FlatFixtureTreeItem;
};
function FixtureActionSlotContainer({
  fixtureActionOrder,
  fixtureItem,
}: FixtureActionSlotContainerProps) {
  const slotProps = React.useMemo(() => ({ fixtureItem }), [fixtureItem]);
  return (
    <FixtureActionSlot slotProps={slotProps} plugOrder={fixtureActionOrder} />
  );
}

function findFixtureItemById(
  fixtureItems: FlatFixtureTreeItem[],
  fixtureId: FixtureId
) {
  if (fixtureId.name) {
    return fixtureItems.find(fixtureItem =>
      isEqual(fixtureItem.fixtureId, fixtureId)
    );
  }

  // When a multi fixture is selected by path only, the first of its named
  // fixtures will be selected.
  return fixtureItems.find(
    fixtureItem => fixtureItem.fixtureId.path === fixtureId.path
  );
}

function getFixtureName({ name, fileName }: FlatFixtureTreeItem) {
  return name ? `${fileName} ${name}` : fileName;
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

const FixtureName = styled.div`
  margin: 0 32px;
  padding: 4px 0;
  color: ${grey176};
  line-height: 24px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;
