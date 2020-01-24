import React from 'react';
import styled from 'styled-components';
import { useViewportEnter } from './shared/useViewportEnter';
import { getSlideInStyle, slideInTransition } from './shared/slideIn';

export function Highlights() {
  return (
    <Container>
      <Highlight
        src="/fixture-list.png"
        altText="Fixture tree view"
        caption="Browse components using your existing file structure."
      />
      <Highlight
        src="/fixture-search.png"
        altText="Global fixture search"
        caption="⌘ + P from anywhere to search for a component fixture."
      />
      <Highlight
        src="/props-panel.png"
        altText="Props input panel"
        caption="Test prop values in real time using auto inferred input types."
      />
      <Highlight
        src="/responsive-mode.png"
        altText="Responsive preview mode"
        caption="Preview components under any viewport size."
      />
    </Container>
  );
}

const blockWidth = 400;
const padding = 32;
const halfWidth = blockWidth * 2 + padding;
const fullWidth = blockWidth * 4 + padding * 3;
const sideMargin = padding * 2;

const Container = styled.div`
  margin: 0 auto;
  display: flex;
  flex-direction: column;

  @media (min-width: ${halfWidth + sideMargin}px) {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;
    width: ${halfWidth}px;
  }

  @media (min-width: ${fullWidth + sideMargin}px) {
    width: ${fullWidth}px;
  }
`;

type HighlightProps = {
  src: string;
  altText: string;
  caption: string;
};

function Highlight({ src, altText, caption }: HighlightProps) {
  const [ref, entered] = useViewportEnter(0.66);
  return (
    <HighlightContainer ref={ref} style={getSlideInStyle(entered)}>
      <Image src={src} alt={altText} />
      <Caption>{caption}</Caption>
    </HighlightContainer>
  );
}

const HighlightContainer = styled.div`
  position: relative;
  max-width: 400px;
  margin: 0 auto 56px auto;
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
