import React from 'react';
import { Header } from './Header.js';
import { TodoProvider } from './TodoContext.js';

export default () => (
  <TodoProvider>
    <div className="todoapp">
      <Header />
    </div>
  </TodoProvider>
);
