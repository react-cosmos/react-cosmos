import React from 'react';
import { ComponentLibrary } from './Features/ComponentLibrary';
import { OpenPlatform } from './Features/OpenPlatform';
import { VisualTdd } from './Features/VisualTdd';
import { Page } from './Page';

export default {
  'Visual TDD': (
    <Page>
      <VisualTdd />
    </Page>
  ),
  'Component library': (
    <Page>
      <ComponentLibrary />
    </Page>
  ),
  'Open platform': (
    <Page>
      <OpenPlatform />
    </Page>
  )
};
