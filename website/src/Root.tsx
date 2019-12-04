import React from 'react';
import styled from 'styled-components';
import { Features } from './Features/Features';
import { Header } from './Header/Header';
import { LinksScreen } from './LinksScreen';

export function Root() {
  return (
    <>
      <Header />
      <Content>
        <Center>
          <Features />
          <LinksScreen />
        </Center>
      </Content>
    </>
  );
}

const Content = styled.div`
  box-sizing: border-box;
  padding: 100vh 0 50vh 0;
  line-height: 1.5em;
`;

const Center = styled.div`
  max-width: 960px;
  margin: 0 auto;
`;
