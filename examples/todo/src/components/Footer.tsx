import React from 'react';
import { TodoFilter } from '../types.js';
import { useTodoContext } from './TodoContext.js';

export function Footer() {
  const { todos, setTodos } = useTodoContext();

  function handleClearCompleted() {
    setTodos(todos.filter(i => !i.done));
  }

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{todos.filter(i => !i.done).length}</strong> items left
      </span>
      <ul className="filters">
        <Filter filter="all">All</Filter>
        <Filter filter="active">Active</Filter>
        <Filter filter="completed">Completed</Filter>
      </ul>
      {todos.some(i => i.done) && (
        <button className="clear-completed" onClick={handleClearCompleted}>
          Clear completed
        </button>
      )}
    </footer>
  );
}

type FilterProps = {
  filter: TodoFilter;
  children: React.ReactNode;
};
function Filter({ filter, children }: FilterProps) {
  const { filter: currentFilter, setFilter } = useTodoContext();

  return (
    <li>
      <a
        href="#"
        className={filter === currentFilter ? 'selected' : ''}
        onClick={e => {
          e.preventDefault();
          setFilter(filter);
        }}
      >
        {children}
      </a>
    </li>
  );
}
