import React from 'react';
import { Todo } from './types.js';

type Props = {
  todo: Todo;
  onChange(label: string): void;
  onToggleDone(): void;
  onDelete(): void;
};
export function TodoItem({ todo, onChange, onToggleDone, onDelete }: Props) {
  const [editing, setEditing] = React.useState(false);

  function handleClick(e: React.MouseEvent<HTMLElement>) {
    if (e.detail === 2) setEditing(true);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' || e.key === 'Escape') {
      setEditing(false);
      onChange(e.currentTarget.value.trim());
    }
  }

  function handleBlur() {
    setEditing(false);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(e.target.value);
  }

  function handleDelete(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    onDelete();
  }

  const classNames = [];
  if (editing) classNames.push('editing');
  if (todo.done) classNames.push('completed');

  return (
    <li onClick={handleClick} className={classNames.join(' ')}>
      <div className="view">
        <input
          type="checkbox"
          className="toggle"
          checked={todo.done}
          onChange={onToggleDone}
          onClick={e => e.stopPropagation()}
        />
        <label>{todo.label}</label>
        <button className="destroy" onClick={handleDelete} />
      </div>
      {editing && (
        <input
          className="edit"
          autoFocus
          value={todo.label}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={handleBlur}
        />
      )}
    </li>
  );
}
