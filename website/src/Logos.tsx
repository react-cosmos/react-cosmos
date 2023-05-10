import React from 'react';
import styled from 'styled-components';
import { contentMaxWidth } from './shared/breakpoints.js';
import { getSlideInStyle, slideInTransition } from './shared/slideIn.js';
import { useViewportEnter } from './shared/useViewportEnter.js';

export function Logos() {
  const [ref, entered] = useViewportEnter(0.7);
  return (
    <Container ref={ref} style={getSlideInStyle(entered)}>
      <Title>Trusted by</Title>
      <List>
        <Item>
          <LogoImage src="/logos/stadiumgoods.svg" alt="Stadium Goods" />
        </Item>
        <Item>
          <LogoImage src="/logos/formidable.svg" alt="Formidable" />
        </Item>
        <Item>
          <LogoImage src="/logos/hootsuite.svg" alt="Hootsuite" />
        </Item>
        <Item>
          <LogoImage
            src="/logos/globalctoforum.svg"
            alt="Global CTO Forum"
            style={{ padding: '2% 10%' }}
          />
        </Item>
        <Item>
          <LogoImage
            src="/logos/radity.png"
            alt="Radity"
            style={{ padding: '2% 10%' }}
          />
        </Item>
      </List>
    </Container>
  );
}

const Container = styled.div`
  transition: ${slideInTransition};
`;

const Title = styled.div`
  padding: 16px 0;
  color: #0a2e46;
  font-size: 20px;
  font-weight: 500;
  line-height: 24px;
  text-align: center;
  text-transform: uppercase;
  opacity: 0.5;
`;

const List = styled.div`
  margin: 0 auto;
  max-width: 1200px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  @media (max-width: ${contentMaxWidth}px) {
    flex-direction: column;
  }
`;

const Item = styled.div`
  flex: 1;
  padding: 20px 0;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: ${contentMaxWidth}px) {
    width: 200px;
  }
`;

const LogoImage = styled.img`
  box-sizing: border-box;
  width: 100%;
  object-fit: contain;
  opacity: 0.7;
`;
