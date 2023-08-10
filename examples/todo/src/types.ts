export type Todo = {
  id: number;
  label: string;
  done: boolean;
};

export type TodoFilter = 'all' | 'active' | 'completed';
