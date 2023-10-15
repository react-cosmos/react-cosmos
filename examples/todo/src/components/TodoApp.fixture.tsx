import React from 'react';
import { TodoApp } from './TodoApp.js';
import { TodoProvider } from './TodoContext.js';

export default () => (
  <TodoProvider>
    <TodoApp />
  </TodoProvider>
);
