import React from 'react';
import { useTodoContext } from '../TodoContext.js';
import { TodoItem } from './TodoItem.js';

export function TodoList() {
  const { todos, setTodos, filter } = useTodoContext();

  const visibleTodos = todos.filter(i => {
    if (filter === 'active') {
      return !i.done;
    } else if (filter === 'completed') {
      return i.done;
    } else {
      return true;
    }
  });

  return (
    <ul className="todo-list">
      {visibleTodos.map(todo => {
        function handleChange(value: string) {
          setTodos(
            todos.map(t => (t.id === todo.id ? { ...t, label: value } : t))
          );
        }

        function handleToggleDone() {
          setTodos(
            todos.map(t => (t.id === todo.id ? { ...t, done: !t.done } : t))
          );
        }

        function handleDelete() {
          setTodos(todos.filter(t => t.id !== todo.id));
        }

        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            onChange={handleChange}
            onToggleDone={handleToggleDone}
            onDelete={handleDelete}
          />
        );
      })}
    </ul>
  );
}
