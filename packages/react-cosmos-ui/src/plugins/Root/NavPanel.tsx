import React from 'react';
import { ArraySlot } from 'react-plugin';
import styled from 'styled-components';
import { IconButton32 } from '../../components/buttons/IconButton32.js';
import { LockIcon, UnlockIcon } from '../../components/icons/index.js';
import { NavPanelRowSlot } from '../../slots/NavPanelRowSlot.js';
import { grey32, white10 } from '../../style/colors.js';

type Props = {
  rendererConnected: boolean;
  panelsLocked: boolean;
  setPanelsLocked: (locked: boolean) => unknown;
  navPanelRowOrder: string[];
  globalActionOrder: string[];
  onClose: () => unknown;
};

export const NavPanel = React.memo(function NavPanel({
  rendererConnected,
  panelsLocked,
  setPanelsLocked,
  navPanelRowOrder,
  globalActionOrder,
  onClose,
}: Props) {
  const slotProps = React.useMemo(
    () => ({ onCloseNavPanel: onClose }),
    [onClose]
  );

  return (
    <Container>
      <Content>
        <NavPanelRowSlot slotProps={slotProps} plugOrder={navPanelRowOrder} />
      </Content>
      <Separator />
      <Footer>
        {rendererConnected && (
          <ArraySlot name="globalAction" plugOrder={globalActionOrder} />
        )}
        <IconButton32
          icon={panelsLocked ? <LockIcon /> : <UnlockIcon />}
          title={panelsLocked ? 'Unlock panels' : 'Lock panels'}
          selected={panelsLocked}
          onClick={() => setPanelsLocked(!panelsLocked)}
        />
      </Footer>
    </Container>
  );
});

const Container = styled.div`
  width: 100%;
  height: 100%;
  background: ${grey32};
  display: flex;
  flex-direction: column;

  ::after {
    content: '';
    position: absolute;
    top: 1px;
    right: 0;
    bottom: 0;
    width: 1px;
    background: ${white10};
  }
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const Footer = styled.div`
  flex-shrink: 0;
  height: 40px;
  padding: 0 4px;
  background: ${grey32};
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;
`;

// Add 1px right gap to avoid overlapping with the nav pane right-side border
const Separator = styled.div`
  margin: 0 8px;
  height: 1px;
  background: ${white10};
`;
