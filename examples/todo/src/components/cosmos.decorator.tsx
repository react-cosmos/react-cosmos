import React from 'react';
import { TodoProvider } from './TodoContext.js';

export default ({ children }: { children: React.ReactNode }) => {
  return <TodoProvider>{children}</TodoProvider>;
};
