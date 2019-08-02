import React from 'react';
import styled from 'styled-components';
import { ChevronRightIcon } from '../../shared/icons';
import { DarkIconButton } from '../../shared/ui/buttons';
import { ArraySlot } from 'react-plugin';

type Props = {
  rendererConnected: boolean;
  miniNavActionOrder: string[];
  onOpenNav: () => unknown;
};

export function MiniNav({
  rendererConnected,
  onOpenNav,
  miniNavActionOrder
}: Props) {
  if (!rendererConnected) {
    return <Container />;
  }

  return (
    <Container>
      <DarkIconButton
        title="Open nav bar"
        icon={<ChevronRightIcon />}
        onClick={onOpenNav}
      />
      <ArraySlot name="miniNavAction" plugOrder={miniNavActionOrder} />
    </Container>
  );
}

const Container = styled.div`
  width: 32px;
  padding: 4px;

  > button {
    margin-top: 4px;

    :first-child {
      margin-top: 0;
    }
  }
`;
