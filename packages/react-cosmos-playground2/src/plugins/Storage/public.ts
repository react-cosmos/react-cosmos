export type StorageSpec = {
  name: 'storage';
  methods: {
    getItem(key: string): Promise<any>;
    setItem(key: string, value: any): Promise<void>;
  };
};
