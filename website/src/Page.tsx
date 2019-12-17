import React from 'react';
import styled from 'styled-components';
import { Footer } from './Footer/Footer';
import { bgGray, grayToWhiteGradient } from './shared/colors';
import { StickyHeader } from './StickyHeader/StickyHeader';

type Props = {
  children: React.ReactNode;
};

export function Page({ children }: Props) {
  return (
    <Container>
      <StickyHeader />
      <Gradient1>{children}</Gradient1>
      <Footer />
    </Container>
  );
}

const Container = styled.div`
  background: ${bgGray};
`;

const Gradient1 = styled.div`
  background: ${grayToWhiteGradient};
`;
