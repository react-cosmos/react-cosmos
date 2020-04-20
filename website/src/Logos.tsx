import React from 'react';
import styled from 'styled-components';
import { contentMaxWidth } from './shared/breakpoints';
import { getSlideInStyle, slideInTransition } from './shared/slideIn';
import { useViewportEnter } from './shared/useViewportEnter';

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
  max-width: 1024px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  @media (max-width: ${contentMaxWidth}px) {
    flex-direction: column;
  }
`;

const Item = styled.div`
  width: 320px;
  padding: 16px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;

const LogoImage = styled.img`
  width: 288px;
  opacity: 0.7;
`;
