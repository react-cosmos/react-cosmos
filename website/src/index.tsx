import React from 'react';
import { createRoot } from 'react-dom/client';
import pages from './Page.fixture';
import { Root } from './Root.js';
import './global.css';

type PageName = keyof typeof pages;

const root = createRoot(document.getElementById('root')!);
root.render(getRootElement());

function getRootElement() {
  const pageName = (window as any).pageName as PageName | undefined;
  return pageName ? pages[pageName] : <Root />;
}
