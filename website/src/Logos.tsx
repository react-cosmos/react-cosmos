import React from 'react';
import styled from 'styled-components';
import { contentMaxWidth } from './shared/breakpoints';
import { getSlideInStyle, slideInTransition } from './shared/slideIn';
import { useViewportEnter } from './shared/useViewportEnter';

export function Logos() {
  const [ref, entered] = useViewportEnter(0.7);
  const linkRef = React.useRef<HTMLAnchorElement>(null);
  React.useEffect(() => {
    if (entered && linkRef.current) linkRef.current.href = getEmailAddress();
  }, [entered]);
  return (
    <Container ref={ref} style={getSlideInStyle(entered)}>
      <Title>Trusted by</Title>
      <List>
        <Item>
          <LogoImage src="/logos/stadiumgoods.svg" alt="Stadium Goods" />
        </Item>
        <Item>
          <LogoImage src="/logos/hootsuite.png" alt="Hootsuite" />
        </Item>
        <Item>
          <YouLink ref={linkRef} href="#">
            Your company?
          </YouLink>
        </Item>
      </List>
    </Container>
  );
}

function getEmailAddress() {
  return ['mail', 'to:', 'hello', '@', 'reactcosmos.org'].join('');
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

const YouLink = styled.a`
  margin-top: -6px;
  color: #0a2e46;
  font-size: 40px;
  font-weight: 500;
  letter-spacing: -0.04em;
  text-decoration: none;
  white-space: nowrap;
  opacity: 0.7;
  transition: 0.4s opacity;

  :hover {
    opacity: 0.9;
  }

  @media (max-width: ${contentMaxWidth}px) {
    font-size: 38px;
  }
`;
