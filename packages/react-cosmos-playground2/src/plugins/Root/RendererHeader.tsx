import React from 'react';
import { FixtureId } from 'react-cosmos-shared2/renderer';
import styled from 'styled-components';
import {
  RefreshCwIcon,
  XCircleIcon,
  MenuIcon,
  SlidersIcon
} from '../../shared/icons';
import { RendererActionSlot } from '../../shared/slots/RendererActionSlot';
import { IconButton32 } from '../../shared/ui/buttons';
import { grey192, grey32, white10 } from '../../shared/ui/colors';

type Props = {
  fixtureId: FixtureId;
  navOpen: boolean;
  panelOpen: boolean;
  rendererActionOrder: string[];
  onToggleNav: () => unknown;
  onTogglePanel: () => unknown;
  onReload: () => unknown;
  onClose: () => unknown;
};

export const RendererHeader = React.memo(function RendererHeader({
  fixtureId,
  navOpen,
  panelOpen,
  rendererActionOrder,
  onToggleNav,
  onTogglePanel,
  onReload,
  onClose
}: Props) {
  const slotProps = React.useMemo(() => ({ fixtureId }), [fixtureId]);
  return (
    <Container>
      <Left>
        <IconButton32
          icon={<MenuIcon />}
          title="Toggle fixture list"
          selected={navOpen}
          onClick={onToggleNav}
        />
        <ButtonSeparator />
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
  color: ${grey192};
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
