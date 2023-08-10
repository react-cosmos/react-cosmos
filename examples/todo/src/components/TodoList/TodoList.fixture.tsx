import React from 'react';
import { TodoProvider } from '../TodoContext.js';
import { TodoList } from './TodoList.js';

export default () => {
  return (
    <TodoProvider>
      <div className="todoapp">
        <section className="main">
          <TodoList />
        </section>
      </div>
    </TodoProvider>
  );
};
