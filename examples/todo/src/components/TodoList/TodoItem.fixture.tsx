import React from 'react';
import { useValue } from 'react-cosmos/client';
import { TodoItem } from './TodoItem.js';

export default () => {
  const [label, setLabel] = useValue('label', {
    defaultValue: 'Eat the homework',
  });

  const [done, setDone] = useValue('done', {
    defaultValue: false,
  });

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
