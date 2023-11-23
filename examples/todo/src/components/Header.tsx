import React from 'react';
import { useTodoContext } from './TodoContext.js';

export function Header() {
  const { todos, setTodos } = useTodoContext();

  const [newValue, setNewValue] = React.useState('');

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
  );
}
