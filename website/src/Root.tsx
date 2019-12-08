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
      <Gradient1>
        <Features />
      </Gradient1>
      <Gradient2>
        <Hero />
        <Quote />
      </Gradient2>
      <About />
      <Footer />
    </>
  );
}

const Gradient1 = styled.div`
  padding: 100vh 0 0 0;
  background: linear-gradient(#d6dde2, #fff);
`;

const Gradient2 = styled.div`
  background: linear-gradient(#fff, #d6dde2);
`;
