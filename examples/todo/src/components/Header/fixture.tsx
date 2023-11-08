import React from 'react';
import { TodoProvider } from '../TodoContext.js';
import { Header } from './index.js';

export default () => (
  <TodoProvider>
    <div className="todoapp">
      <Header />
    </div>
  </TodoProvider>
);
