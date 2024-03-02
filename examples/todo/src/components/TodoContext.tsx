import React from 'react';
import { useCosmosInput, useCosmosSelect } from 'react-cosmos/client';
import { Todo, TodoFilter } from '../types.js';

type ContextValue = {
  todos: Todo[];
  setTodos: (todos: Todo[]) => void;
  filter: TodoFilter;
  setFilter: (filter: TodoFilter) => void;
};

const TodoContext = React.createContext<ContextValue>({
  todos: [],
  setTodos: () => {},
  filter: 'all',
  setFilter: () => {},
});

const defaultTodos: Todo[] = [
  {
    id: 1,
    label: 'Work out',
    done: false,
  },
  {
    id: 2,
    label: 'Do the dishes',
    done: false,
  },
  {
    id: 3,
    label: 'Pay the bills',
    done: true,
  },
];

type ProviderProps = {
  children: React.ReactNode;
};
export function TodoProvider({ children }: ProviderProps) {
  const [todos, setTodos] = useCosmosInput('todos', defaultTodos);

  const [filter, setFilter] = useCosmosSelect<TodoFilter>('filter', {
    defaultValue: 'all',
    options: ['all', 'active', 'completed'],
  });

  return (
    <TodoContext.Provider value={{ todos, setTodos, filter, setFilter }}>
      {children}
    </TodoContext.Provider>
  );
}

export function useTodoContext() {
  return React.useContext(TodoContext);
}
