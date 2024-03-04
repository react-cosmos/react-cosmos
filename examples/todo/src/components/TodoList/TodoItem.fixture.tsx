import React from 'react';
import { useFixtureInput } from 'react-cosmos/client';
import { TodoItem } from './TodoItem.js';

export default () => {
  const [label, setLabel] = useFixtureInput('label', 'Eat the homework');
  const [done, setDone] = useFixtureInput('done', false);
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
