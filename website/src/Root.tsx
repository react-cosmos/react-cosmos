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
import { grayToWhiteGradient, whiteToGrayGradient } from './shared/colors';
import { SplashScreen } from './SplashScreen/SplashScreen';
import { Height } from './shared/Height';

const headerHeight = 81;

export function Root() {
  return (
    <>
      <SplashScreen />
      <StickyHeader />
      <Gradient1 id="gradient1">
        <Height
          mobile={headerHeight + 96}
          tablet={headerHeight + 128}
          desktop={headerHeight + 192}
        />
        <Hero />
        <Height mobile={96} tablet={128} desktop={192} />
        <Features />
        <Height mobile={96} tablet={128} desktop={192} />
      </Gradient1>
      <Gradient2>
        <Rocket />
        <Height mobile={32} tablet={64} desktop={96} />
        <Benefits />
        <Height mobile={128} tablet={160} desktop={192} />
        <Quote />
        <Height mobile={64} tablet={96} desktop={128} />
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
  background: ${whiteToGrayGradient};
`;
