import React from 'react';
import { Footer } from './Footer.js';
import { TodoProvider } from './TodoContext.js';

export default () => (
  <TodoProvider>
    <div className="todoapp">
      <Footer />
    </div>
  </TodoProvider>
);
