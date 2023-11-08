import React from 'react';
import { TodoProvider } from '../TodoContext.js';
import { Footer } from './index.js';

export default () => (
  <TodoProvider>
    <div className="todoapp">
      <Footer />
    </div>
  </TodoProvider>
);
