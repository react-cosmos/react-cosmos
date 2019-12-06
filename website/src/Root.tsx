import React from 'react';
import styled from 'styled-components';
import { Features } from './Features/Features';
import { Header } from './Header/Header';
import { Hero } from './Hero';
import { Quote } from './Quote';

export function Root() {
  return (
    <>
      <Header />
      <Content>
        <Center>
          <Features />
        </Center>
        <Gradient>
          <Hero />
          <Quote />
        </Gradient>
        <Footer id="footer" />
      </Content>
    </>
  );
}

const Content = styled.div`
  box-sizing: border-box;
  padding: 100vh 0 0 0;
  line-height: 1.5em;
`;

const Center = styled.div`
  max-width: 960px;
  margin: 0 auto;
`;

const Gradient = styled.div`
  background: linear-gradient(#fff, #d6dde2);
`;

const Footer = styled.div`
  background: #0a2e46;
  height: 100vh;
`;
