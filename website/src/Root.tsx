import React from 'react';
import styled from 'styled-components';
import { Features } from './Features/Features';
import { Header } from './Header/Header';
import { MAX_CONTENT_WIDTH_PX } from './Header/shared';
import { HEADER_SCROLL_LENGTH_PX } from './Header/useHeaderScroll';
import { LinksScreen } from './LinksScreen';

export function Root() {
  return (
    <Container>
      <Header />
      <Content>
        <Center>
          <Features />
          <LinksScreen />
        </Center>
      </Content>
    </Container>
  );
}

const Container = styled.div`
  padding-top: ${HEADER_SCROLL_LENGTH_PX}px;
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
