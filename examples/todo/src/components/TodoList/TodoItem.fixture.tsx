import React from 'react';
import { useCosmosInput } from 'react-cosmos/client';
import { TodoItem } from './TodoItem.js';

export default () => {
  const [label, setLabel] = useCosmosInput('label', 'Eat the homework');
  const [done, setDone] = useCosmosInput('done', false);
  return (
    <div className="todoapp">
      <section className="main">
        <ul className="todo-list">
          <TodoItem
            todo={{ id: 1, label, done }}
            onChange={setLabel}
            onToggleDone={() => setDone(prev => !prev)}
            onDelete={() => alert('Delete todo')}
          />
        </ul>
      </section>
    </div>
  );
};
