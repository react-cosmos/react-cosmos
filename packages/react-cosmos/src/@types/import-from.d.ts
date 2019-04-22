declare module 'import-from' {
  function importFrom<T>(fromDir: string, moduleId: string): T;

  namespace importFrom {
    function silent<T>(fromDir: string, moduleId: string): T | null;
  }

  export = importFrom;
}
