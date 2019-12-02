import React from 'react';
import styled from 'styled-components';
import { Features } from './Features/Features';
import { Header } from './Header/Header';
import { MAX_CONTENT_WIDTH_PX } from './shared';
import { HEADER_SCROLL_LENGTH_PX, useHeaderScroll } from './useHeaderScroll';
import { useWindowViewport } from './useWindowViewport';
import { useWindowYScroll } from './useWindowYScroll';

export function Root() {
  const windowViewport = useWindowViewport();
  const yScroll = useWindowYScroll();
  const { cropRatio, minimizeRatio } = useHeaderScroll(yScroll);

  return (
    <Container white={cropRatio > 0.1}>
      <Header
        windowViewport={windowViewport}
        cropRatio={cropRatio}
        minimizeRatio={minimizeRatio}
      />
      <Content>
        <Center>
          <Features visible={minimizeRatio === 1} />
        </Center>
      </Content>
    </Container>
  );
}

const Container = styled.div<{ white: boolean }>`
  padding-top: ${HEADER_SCROLL_LENGTH_PX}px;
  background: ${props => (props.white ? '#fff' : '#093556')};
  color: #0a2e46;
`;

const Content = styled.div`
  box-sizing: border-box;
  padding: 50vh 0;
  line-height: 1.5em;
`;

const Center = styled.div`
  max-width: ${MAX_CONTENT_WIDTH_PX}px;
  margin: 0 auto;
`;
