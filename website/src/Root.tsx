import React from 'react';
import styled from 'styled-components';
import { About } from './About';
import { Benefits } from './Benefits';
import { Features } from './Features/Features';
import { Footer } from './Footer/Footer';
import { StickyHeader } from './Header/StickyHeader';
import { Hero } from './Hero';
import { Quote } from './Quote';
import { Rocket } from './Rocket';
import { mobileMaxWidth } from './shared/breakpoints';
import { grayToWhiteGradient, whiteToGrayGradient } from './shared/colors';
import { SplashScreen } from './SplashScreen/SplashScreen';

export function Root() {
  return (
    <>
      <SplashScreen />
      <Gradient1 id="gradient1">
        <StickyHeader />
        <Features />
        <Rocket />
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
  background: ${grayToWhiteGradient};
`;

const Gradient2 = styled.div`
  padding: 384px 0 0 0;
  background: ${whiteToGrayGradient};

  @media (max-width: ${mobileMaxWidth}px) {
    padding-top: 256px;
  }
`;
