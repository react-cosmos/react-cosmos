import React from 'react';
import { TodoList } from './TodoList.js';

export default () => {
  return (
    <div className="todoapp">
      <section className="main">
        <TodoList />
      </section>
    </div>
  );
};
