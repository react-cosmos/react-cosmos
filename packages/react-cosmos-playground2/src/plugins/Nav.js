// @flow

import React from 'react';
import styled from 'styled-components';
import { Plugin, Plug, Slot } from 'react-plugin';
import { Section } from '../Section';

export default (
  <Plugin name="Nav">
    <Plug slot="root" render={Nav} />
  </Plugin>
);

function Nav() {
  return (
    <Slot name="root">
      <Container>
        <Left>
          <NavHeader>
            <Slot name="nav-header" />
          </NavHeader>
          <NavBody>
            <Section label="Nav" />
          </NavBody>
        </Left>
        <Right>
          <Slot name="preview" />
        </Right>
      </Container>
    </Slot>
  );
}

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: row;
`;

const Left = styled.div`
  flex-shrink: 0;
  width: 256px;
  display: flex;
  flex-direction: column;
`;

const Right = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const NavHeader = styled.div`
  flex-shrink: 0;
`;

const NavBody = styled.div`
  flex: 1;
  display: flex;
`;
