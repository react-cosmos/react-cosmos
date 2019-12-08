import React from 'react';
import styled from 'styled-components';
import { About } from './About';
import { Features } from './Features/Features';
import { Footer } from './Footer';
import { Header } from './Header/Header';
import { Hero } from './Hero';
import { Quote } from './Quote';

export function Root() {
  return (
    <>
      <Header />
      <Content>
        <Features />
        <Gradient>
          <Hero />
          <Quote />
        </Gradient>
        <About />
        <Footer />
      </Content>
    </>
  );
}

const Content = styled.div`
  box-sizing: border-box;
  padding: 100vh 0 0 0;
  line-height: 1.5em;
`;

const Gradient = styled.div`
  background: linear-gradient(#fff, #d6dde2);
`;
