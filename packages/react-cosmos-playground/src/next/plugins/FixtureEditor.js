// @flow

import React from 'react';
import styled from 'styled-components';
import { Plugin, Plug, Slot } from 'react-plugin';
import { createNavHeaderButtonPlug } from './NavHeader';
import { Section } from '../Section';

export default (
  <Plugin name="Fixture Editor">
    <Plug slot="preview" render={FixtureEditor} />
    {createNavHeaderButtonPlug('Toggle editor')}
  </Plugin>
);

function FixtureEditor({ children }: any) {
  return (
    <Container>
      <Left>
        <Section label="Fixture editor" />
      </Left>
      <Right>
        <Slot name="preview">{children}</Slot>
      </Right>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: row;
  flex: 1;
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
