import React from 'react';
import { Todo, TodoFilter } from '../types.js';
import { TodoList } from './TodoList.js';

type Props = {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  filter: TodoFilter;
  setFilter: (filter: TodoFilter) => void;
};
export function TodoApp({ todos, setTodos, filter, setFilter }: Props) {
  const [newValue, setNewValue] = React.useState('');

  function handleToggleAll() {
    setTodos(todos.map(i => ({ ...i, done: true })));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      if (newValue) {
        const maxId = todos.reduce((p, c) => Math.max(p, c.id), 0);
        setTodos([...todos, { id: maxId + 1, label: newValue, done: false }]);
        setNewValue('');
      }
    } else if (e.key === 'Escape') {
      setNewValue('');
    }
  }

  function handleClearCompleted() {
    setTodos(todos.filter(i => !i.done));
  }

  return (
    <div className="todoapp">
      <header className="header">
        <h1>todos</h1>
        <input
          className="new-todo"
          placeholder="What needs to be done?"
          value={newValue}
          onChange={e => setNewValue(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </header>

      <section className="main">
        <input
          id="toggle-all"
          type="checkbox"
          className="toggle-all"
          checked={todos.every(i => i.done)}
          onChange={handleToggleAll}
        />
        <label htmlFor="toggle-all" />
        <TodoList todos={todos} setTodos={setTodos} filter={filter} />
      </section>

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
    </div>
  );
}
