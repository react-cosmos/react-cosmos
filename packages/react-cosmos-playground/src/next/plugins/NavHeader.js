// @flow

import React from 'react';
import { Plugin, Plug, Slot } from 'react-plugin';

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
      <div>Nav header</div>
      <ul>
        <li>
          <NavHeaderButton>Home</NavHeaderButton>
          <Slot name="nav-header-button" />
          <NavHeaderButton>Full screen</NavHeaderButton>
        </li>
      </ul>
    </Slot>
  );
}

function NavHeaderButton({ children }) {
  return <button>{children}</button>;
}
