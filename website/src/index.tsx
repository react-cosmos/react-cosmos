import React from 'react';
import { createRoot } from 'react-dom/client';
import './global.css';
import pages from './Page.fixture';
import { Root } from './Root.js';

type PageName = keyof typeof pages;

const root = createRoot(document.getElementById('root')!);
root.render(getRootElement());

function getRootElement() {
  const pageName = (window as any).pageName as PageName | undefined;
  return pageName ? pages[pageName] : <Root />;
}
