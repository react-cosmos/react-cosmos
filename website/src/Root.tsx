import React from 'react';
import styled from 'styled-components';
import { About } from './About';
import { Benefits } from './Benefits';
import { Features } from './Features/Features';
import { Footer } from './Footer';
import { Header } from './Header/Header';
import { Hero } from './Hero';
import { Quote } from './Quote';
import { grayToWhiteGradient, whiteToGrayGradient } from './shared/ui';

export function Root() {
  return (
    <>
      <Header />
      <Gradient1 id="index">
        <Features />
        <Benefits />
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
  background: ${grayToWhiteGradient};
`;

const Gradient2 = styled.div`
  background: ${whiteToGrayGradient};
`;
