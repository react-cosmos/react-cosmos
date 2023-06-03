import React from 'react';
import { useTodoContext } from './TodoContext.js';

export function Footer() {
  const { todos, setTodos, filter, setFilter } = useTodoContext();

  function handleClearCompleted() {
    setTodos(todos.filter(i => !i.done));
  }

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{todos.filter(i => !i.done).length}</strong> items left
      </span>
      <ul className="filters">
        <li>
          <a
            href="#"
            className={filter === 'all' ? 'selected' : ''}
            onClick={e => {
              e.preventDefault();
              setFilter('all');
            }}
          >
            All
          </a>
        </li>
        <li>
          <a
            href="#"
            className={filter === 'active' ? 'selected' : ''}
            onClick={e => {
              e.preventDefault();
              setFilter('active');
            }}
          >
            Active
          </a>
        </li>
        <li>
          <a
            href="#"
            className={filter === 'completed' ? 'selected' : ''}
            onClick={e => {
              e.preventDefault();
              setFilter('completed');
            }}
          >
            Completed
          </a>
        </li>
      </ul>
      {todos.some(i => i.done) && (
        <button className="clear-completed" onClick={handleClearCompleted}>
          Clear completed
        </button>
      )}
    </footer>
  );
}
