import React from 'react';
import { useSelect, useValue } from 'react-cosmos/client';
import { TodoList } from './TodoList.js';
import { Todo, TodoFilter } from './types.js';

export default () => {
  const [filter] = useSelect<TodoFilter>('filter', {
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
    <div className="todoapp">
      <section className="main">
        <TodoList todos={todos} setTodos={setTodos} filter={filter} />
      </section>
    </div>
  );
};
