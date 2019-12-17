import React from 'react';
import styled from 'styled-components';
import { About } from './About';
import { Benefits } from './Benefits';
import { Features } from './Features/Features';
import { Footer } from './Footer/Footer';
import { Hero } from './Hero';
import { Quote } from './Quote';
import {
  bgGray,
  grayToWhiteGradient,
  whiteToGrayGradient
} from './shared/colors';
import { SplashScreen } from './SplashScreen/SplashScreen';
import { StickyHeader } from './StickyHeader/StickyHeader';

export function Root() {
  return (
    <Container>
      <SplashScreen />
      <StickyHeader />
      <Gradient1>
        <Features />
        <Benefits />
      </Gradient1>
      <Gradient2>
        <Hero />
        <Quote />
      </Gradient2>
      <About />
      <Footer />
    </Container>
  );
}

const Container = styled.div`
  background: ${bgGray};
`;

const Gradient1 = styled.div`
  background: ${grayToWhiteGradient};
`;

const Gradient2 = styled.div`
  background: ${whiteToGrayGradient};
`;
