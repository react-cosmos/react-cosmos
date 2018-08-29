// @flow

import React from 'react';
import styled from 'styled-components';
import { Plugin, Plug, Slot } from 'react-plugin';
import { Section } from '../Section';

export default (
  <Plugin name="Nav header">
    <Plug slot="nav-header" render={NavHeader} />
  </Plugin>
);

export function createNavHeaderButtonPlug(label: string) {
  return (
    <Plug
      slot="nav-header-button"
      render={({ children = [] }: any) => (
        <Slot name="nav-header-button">
          {[
            ...children,
            <NavHeaderButton key={children.length}>{label}</NavHeaderButton>
          ]}
        </Slot>
      )}
    />
  );
}

function NavHeader() {
  return (
    <Slot name="nav-header">
      <Section label="Nav header">
        <Buttons>
          <NavHeaderButton>Home</NavHeaderButton>
          <Slot name="nav-header-button" />
          <NavHeaderButton>Full screen</NavHeaderButton>
        </Buttons>
      </Section>
    </Slot>
  );
}

function NavHeaderButton({ children }) {
  return (
    <li>
      <button>{children}</button>
    </li>
  );
}

const Buttons = styled.ul`
  list-style: none;

  li {
    margin: 4px;
  }

  button {
    padding: 4px;
    font-size: 16px;
    text-align: left;
  }
`;
