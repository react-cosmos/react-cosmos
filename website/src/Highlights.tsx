import React from 'react';
import styled from 'styled-components';
import { useViewportEnter } from './shared/useViewportEnter';
import { getSlideInStyle, slideInTransition } from './shared/slideIn';

export function Highlights() {
  return (
    <Container>
      <Boxes>
        <Box
          src="/fixture-list.png"
          altText="Fixture tree view"
          caption="Browse components using your existing file structure."
        />
        <Box
          src="/fixture-search.png"
          altText="Global fixture search"
          caption="⌘ + P from anywhere to search for a component fixture."
        />
        <Box
          src="/props-panel.png"
          altText="Props input panel"
          caption="Test prop values in real time using auto inferred input types."
        />
        <Box
          src="/responsive-mode.png"
          altText="Responsive preview mode"
          caption="Preview components under any viewport size."
        />
      </Boxes>
    </Container>
  );
}

const blockWidth = 400;
const padding = 32;
const halfWidth = blockWidth * 2 + padding;
const fullWidth = blockWidth * 4 + padding * 3;
const sideMargin = padding * 2;

const Container = styled.div`
  display: flex;
  justify-content: center;
`;

const Boxes = styled.div`
  display: flex;
  flex-direction: column;

  @media (min-width: ${halfWidth + sideMargin}px) {
    width: ${halfWidth}px;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  @media (min-width: ${fullWidth + sideMargin}px) {
    width: ${fullWidth}px;
  }
`;

type BoxProps = {
  src: string;
  altText: string;
  caption: string;
};

function Box({ src, altText, caption }: BoxProps) {
  const [ref, entered] = useViewportEnter(0.66);
  return (
    <BoxContainer ref={ref} style={getSlideInStyle(entered)}>
      <Image src={src} alt={altText} />
      <Caption>{caption}</Caption>
    </BoxContainer>
  );
}

const BoxContainer = styled.div`
  position: relative;
  max-width: 400px;
  margin: 0 0 56px 0;
  transition: ${slideInTransition};

  :nth-child(4) {
    margin-bottom: 0;
  }

  @media (min-width: ${halfWidth + sideMargin}px) {
    :nth-child(3) {
      margin-bottom: 0;
    }
  }

  @media (min-width: ${fullWidth + sideMargin}px) {
    margin-bottom: 0;
  }
`;

const Image = styled.img`
  display: block;
  width: 100%;
  max-width: 400px;
`;

const Caption = styled.div`
  padding: 12px 20px 0 20px;
  font-size: 22px;
  font-weight: 400;
  line-height: 28px;
  letter-spacing: -0.02em;
  text-align: center;
  opacity: 0.9;
`;
