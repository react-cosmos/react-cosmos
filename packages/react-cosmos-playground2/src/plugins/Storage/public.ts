type Cache = {
  projectId: string;
  items: { [key: string]: any };
};

export type StorageSpec = {
  name: 'storage';
  state: {
    cache: null | Cache;
  };
  methods: {
    loadCache(projectId: string): Promise<unknown>;
    getItem<T>(key: string): void | T;
    setItem<T>(key: string, value: T): void;
  };
};
