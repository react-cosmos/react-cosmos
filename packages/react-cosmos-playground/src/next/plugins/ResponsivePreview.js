// @flow

import React from 'react';
import styled from 'styled-components';
import { Plugin, Plug, Slot } from 'react-plugin';
import { createNavHeaderButtonPlug } from './NavHeader';
import { Section } from '../Section';

export default (
  <Plugin name="Responsive Preview">
    <Plug slot="preview" render={ResponsivePreview} />
    {createNavHeaderButtonPlug('Toggle responsive preview')}
  </Plugin>
);

function ResponsivePreview({ children }: any) {
  return (
    <Container>
      <Header>
        <Section label="Responsive controls">
          <Buttons>
            <button>iPhone 5</button>
            <button>iPhone 6</button>
            <button>1080p</button>
          </Buttons>
        </Section>
      </Header>
      <Preview>
        <Slot name="preview">{children}</Slot>
      </Preview>
    </Container>
  );
}

const Container = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Header = styled.div`
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
`;

const Preview = styled.div`
  flex: 1;
  display: flex;
`;

const Buttons = styled.ul`
  button {
    margin: 4px;
    padding: 4px;
    font-size: 16px;
    text-align: left;
  }
`;
