import React from 'react';
import styled from 'styled-components';
import { About } from './About.js';
import { Benefits } from './Benefits.js';
import { Demo } from './Demo.js';
import { Features } from './Features/Features.js';
import { Footer } from './Footer/Footer.js';
import { StickyHeader } from './Header/StickyHeader.js';
import { Highlights } from './Highlights.js';
import { Logos } from './Logos.js';
import { Quote } from './Quote.js';
import { Rocket } from './Rocket.js';
import { SplashScreen } from './SplashScreen/SplashScreen.js';
import { Height } from './shared/Height.js';
import { grayToWhiteGradient, whiteToGrayGradient } from './shared/colors.js';

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
        <Features />
      </Gradient1>
      <WhiteBg>
        <Height mobile={96} tablet={128} desktop={192} />
        <Highlights />
        <Height mobile={96} tablet={128} desktop={192} />
      </WhiteBg>
      <Gradient2>
        <Benefits />
        <Height mobile={64} tablet={96} desktop={128} />
        <Rocket />
        <Height mobile={64} tablet={96} desktop={128} />
        <Quote />
        <Height mobile={64} tablet={96} desktop={128} />
        <Logos />
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
