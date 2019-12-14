import React from 'react';
import { render } from 'react-dom';
import { Benefits } from './Benefits';
import { ComponentLibrary } from './Features/ComponentLibrary';
import { OpenPlatform } from './Features/OpenPlatform';
import { VisualTdd } from './Features/VisualTdd';
import './global.css';
import { Page } from './Page';
import './polyfills';
import { Root } from './Root';

const pages = {
  'visual-tdd': <VisualTdd />,
  'component-library': <ComponentLibrary />,
  'open-platform': <OpenPlatform />,
  benefits: <Benefits />
};

type PageName = keyof typeof pages;

render(getRootElement(), document.getElementById('root'));

function getRootElement() {
  const pageName = (window as any).pageName as PageName | undefined;
  return pageName ? <Page>{pages[pageName]}</Page> : <Root />;
}
