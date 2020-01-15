import React from 'react';
import styled from 'styled-components';
import { mobileMaxWidth } from './shared/breakpoints';
import { ExternalLink } from './shared/ExternalLink';
import { livePreviewUrl } from './shared/livePreviewUrl';
import { getSlideInStyle, slideInTransition } from './shared/slideIn';
import { NoWrap } from './shared/styledPrimitives';
import { useViewportEnter } from './shared/useViewportEnter';

const minPreviewWidth = 960;
const previewPadding = 32;
const maxPreviewWidth = 1280 + 96 + 2 * previewPadding;

export function Demo() {
  const [ref, entered] = useViewportEnter(0.66);
  const showLivePreview = useLivePreview();
  return (
    <Container id="demo">
      <TextContainer ref={ref}>
        <Title style={getSlideInStyle(entered, 0)}>
          Don&apos;t settle for localhost:3000
        </Title>
        <Subtitle style={getSlideInStyle(entered, 0)}>
          Expect more from your <NoWrap>dev environment</NoWrap>
        </Subtitle>
        <CtaContainer style={getSlideInStyle(entered, 1)}>
          <CallToAction href="https://github.com/react-cosmos/react-cosmos#getting-started">
            <Play />
            Get started
          </CallToAction>
        </CtaContainer>
        <Links style={getSlideInStyle(entered, 1)}>
          {!showLivePreview && (
            <Link href={livePreviewUrl}>
              <span>Live demo</span>
              <Chevron />
            </Link>
          )}
          <Link href="https://twitter.com/ReactCosmos/status/1189127279533793281">
            <span>React Cosmos 5 in 21 tweets</span>
            <Chevron />
          </Link>
        </Links>
      </TextContainer>
      <PreviewContainer style={getSlideInStyle(entered, 2)}>
        {showLivePreview && <PreviewIframe src={livePreviewUrl} />}
        {!showLivePreview && (
          <ExternalLink href={livePreviewUrl}>
            <PreviewImage src="/screenshot1.png" alt="Props panel" />
            <PreviewImage src="/screenshot2.png" alt="Fixture search" />
            <PreviewImage src="/screenshot3.png" alt="Responsive mode" />
          </ExternalLink>
        )}
      </PreviewContainer>
    </Container>
  );
}

function useLivePreview() {
  const [showPreview, setShowPreview] = React.useState(shouldShowLivePreview());
  React.useEffect(() => {
    function handleWindowResize() {
      setShowPreview(shouldShowLivePreview());
    }
    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  });
  return showPreview;
}

function shouldShowLivePreview() {
  return window.innerWidth >= minPreviewWidth;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
`;

const TextContainer = styled.div`
  padding: 0 16px;
`;

const Title = styled.div`
  padding: 0 0 12px 0;
  font-size: 48px;
  line-height: 50px;
  font-weight: 600;
  letter-spacing: -0.03em;
  transition: ${slideInTransition};

  @media (max-width: ${mobileMaxWidth}px) {
    font-size: 40px;
    line-height: 42px;
  }
`;

const Subtitle = styled.div`
  color: #566d7e;
  font-size: 32px;
  font-weight: 300;
  line-height: 36px;
  letter-spacing: -0.02em;
  transition: ${slideInTransition};

  @media (max-width: ${mobileMaxWidth}px) {
    font-size: 28px;
    line-height: 32px;
  }
`;

const CtaContainer = styled.div`
  margin-top: 48px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  transition: ${slideInTransition};
`;

const CallToAction = styled(ExternalLink)`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 28px;
  background: #078383;
  color: #fff;
  font-size: 28px;
  font-weight: 400;
  line-height: 64px;
  text-decoration: none;
  white-space: nowrap;

  svg {
    width: 28px;
    height: 28px;
    margin: 0 8px -2px -4px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2px;
  }

  @media (max-width: ${mobileMaxWidth}px) {
    padding: 0 24px;
    font-size: 24px;
    line-height: 56px;

    svg {
      width: 24px;
      height: 24px;
      margin: 0 6px -2px -4px;
    }
  }
`;

export function Play() {
  return (
    <svg viewBox="0 0 24 24" strokeLinecap="square" strokeLinejoin="round">
      <polygon points="5 3 19 12 5 21 5 3"></polygon>
    </svg>
  );
}

const Links = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  padding: 16px 0 0 0;
  font-size: 24px;
  line-height: 24px;
  transition: ${slideInTransition};

  @media (max-width: ${mobileMaxWidth}px) {
    font-size: 20px;
    line-height: 20px;
    font-weight: 500;
  }
`;

const Link = styled(ExternalLink)`
  margin: 16px 12px 0 12px;
  color: #078383;
  font-weight: 400;
  text-decoration: none;
  white-space: nowrap;
  display: flex;
  flex-direction: row;
  align-items: center;

  @media (max-width: ${mobileMaxWidth}px) {
    font-weight: 500;
  }
`;

const Chevron = () => {
  return (
    <StyledChevron
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      strokeLinejoin="round"
    >
      <polyline points="9 18 15 12 9 6"></polyline>
    </StyledChevron>
  );
};

const StyledChevron = styled.svg`
  width: 24px;
  height: 24px;
  margin: 0 0 0 0px;
  transform: translate(0, 2.5px);

  @media (max-width: ${mobileMaxWidth}px) {
    width: 20px;
    height: 20px;
    transform: translate(0, 1.5px);
  }
`;

const PreviewContainer = styled.div`
  box-sizing: border-box;
  width: 100%;
  max-width: ${maxPreviewWidth}px;
  padding: 64px 0 0 0;
  transition: ${slideInTransition};

  @media (min-width: ${minPreviewWidth}px) {
    padding-left: ${previewPadding}px;
    padding-right: ${previewPadding}px;
  }
`;

const PreviewIframe = styled.iframe`
  display: block;
  width: 100%;
  height: 688px;
  border: none;
`;

const PreviewImage = styled.img`
  display: block;
  width: 100%;
  margin: 0 0 32px 0;

  :last-child {
    margin-bottom: 0;
  }
`;
