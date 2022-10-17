import React from 'react';
import styled from 'styled-components';
import { Footer } from './Footer/Footer';
import { Header } from './Header/Header';
import { grayToWhiteGradient } from './shared/colors';

type Props = {
  children: React.ReactNode;
};

export function Page({ children }: Props) {
  return (
    <>
      <Header visible={true} fixed={true} />
      <Gradient1>{children}</Gradient1>
      <Footer />
    </>
  );
}

const Gradient1 = styled.div`
  background: ${grayToWhiteGradient};
`;
