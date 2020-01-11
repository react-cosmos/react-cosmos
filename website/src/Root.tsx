import React from 'react';
import styled from 'styled-components';
import { About } from './About';
import { Benefits } from './Benefits';
import { Demo } from './Demo';
import { Description } from './Description';
import { Features } from './Features/Features';
import { Footer } from './Footer/Footer';
import { StickyHeader } from './Header/StickyHeader';
import { Quote } from './Quote';
import { Rocket } from './Rocket';
import { grayToWhiteGradient, whiteToGrayGradient } from './shared/colors';
import { Height } from './shared/Height';
import { SplashScreen } from './SplashScreen/SplashScreen';

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
        <Demo />
        <Height mobile={96} tablet={128} desktop={192} />
        <Description />
        <Height mobile={64} tablet={64} desktop={96} />
        <Features />
        <Height mobile={96} tablet={128} desktop={192} />
      </Gradient1>
      <WhiteBg>
        <Rocket />
      </WhiteBg>
      <Gradient2>
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

const WhiteBg = styled.div`
  background: #fff;
`;

const Gradient2 = styled.div`
  background: ${whiteToGrayGradient};
`;
