import React from 'react';
import { render } from 'react-dom';
import './global.css';
import pages from './Page.fixture';
import { Root } from './Root.js';

type PageName = keyof typeof pages;

render(getRootElement(), document.getElementById('root'));

function getRootElement() {
  const pageName = (window as any).pageName as PageName | undefined;
  return pageName ? pages[pageName] : <Root />;
}
