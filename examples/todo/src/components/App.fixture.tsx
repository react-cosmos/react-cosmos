import React from 'react';
import { App } from './App.js';
import { TodoProvider } from './TodoContext.js';

export default () => (
  <TodoProvider>
    <App />
  </TodoProvider>
);
