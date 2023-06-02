import React from 'react';
import { useSelect, useValue } from 'react-cosmos/client';
import { Footer } from './Footer.js';
import { TodoApp } from './TodoApp.js';
import { Todo, TodoFilter } from './types.js';

export default () => {
  const [filter, setFilter] = useSelect<TodoFilter>('filter', {
    defaultValue: 'all',
    options: ['all', 'active', 'completed'],
  });

  const [todos, setTodos] = useValue<Todo[]>('todos', {
    defaultValue: React.useMemo(
      () => [
        {
          id: 1,
          label: 'Work out',
          done: false,
        },
        {
          id: 2,
          label: 'Do the dishes',
          done: true,
        },
        {
          id: 3,
          label: 'Pay the bills',
          done: true,
        },
      ],
      []
    ),
  });

  return (
    <>
      <TodoApp
        todos={todos}
        setTodos={setTodos}
        filter={filter}
        setFilter={setFilter}
      />
      <Footer />
    </>
  );
};
