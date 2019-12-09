import React from 'react';
import { render } from 'react-dom';
import './global.css';
import './polyfills';
import { Root } from './Root';

render(<Root />, document.getElementById('root'));
