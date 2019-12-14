import React from 'react';
import styled from 'styled-components';
import { Footer } from './Footer';
import { Cosmonaut } from './Header/Cosmonaut/Cosmonaut';
import { MinimizedHeader } from './Header/MinimizedHeader';
import { MAX_HEADER_WIDTH_PX, Viewport } from './Header/shared';
import { useWindowViewport } from './Header/useWindowViewport';
import {
  grayToWhiteGradient,
  headerBackdropFilter,
  headerBg,
  headerBorderBottom
} from './shared/ui';

type Props = {
  children: React.ReactNode;
};

export function Page({ children }: Props) {
  const windowViewport = useWindowViewport();
  return (
    <>
      <PageHeader>
        <CosmonautContainer style={{ left: getCosmonautLeft(windowViewport) }}>
          <Cosmonaut cropRatio={1} minimizeRatio={1} />
        </CosmonautContainer>
        <MinimizedHeader visible={true} />
      </PageHeader>
      <Gradient1>{children}</Gradient1>
      <Footer />
    </>
  );
}

function getCosmonautLeft(windowViewport: Viewport) {
  const availableHeaderWidth = windowViewport.width - MAX_HEADER_WIDTH_PX;
  return Math.max(0, Math.round(availableHeaderWidth / 2)) + 8;
}

const PageHeader = styled.div`
  position: fixed;
  z-index: 1;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: ${headerBg};
  border-bottom: ${headerBorderBottom};
  backdrop-filter: ${headerBackdropFilter};
`;

const CosmonautContainer = styled.div`
  position: absolute;
  bottom: 8px;
  width: 64px;
  height: 64px;
`;

const Gradient1 = styled.div`
  background: ${grayToWhiteGradient};
`;
