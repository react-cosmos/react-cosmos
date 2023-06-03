import React from 'react';
import { Footer } from './Footer.js';
import { Header } from './Header.js';
import { useTodoContext } from './TodoContext.js';
import { TodoList } from './TodoList/TodoList.js';

export function App() {
  const { todos, setTodos } = useTodoContext();

  function handleToggleAll() {
    setTodos(todos.map(i => ({ ...i, done: true })));
  }

  return (
    <div className="todoapp">
      <Header />

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
