import React from 'react';
import { Footer } from './Footer.js';
import { useTodoContext } from './TodoContext.js';
import { TodoList } from './TodoList.js';

export function TodoApp() {
  const { todos, setTodos } = useTodoContext();

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
        <TodoList />
      </section>

      <Footer />
    </div>
  );
}
