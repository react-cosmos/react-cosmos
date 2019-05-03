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
    getItem(key: string): any;
    setItem(key: string, value: any): void;
  };
};
