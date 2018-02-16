import { ApolloLink, Observable } from 'apollo-link';

export function createFixtureLink(options) {
  return new ApolloLink(
    ({ operationName }) =>
      new Observable(observer => {
        console.log(operationName);

        const { failWith, resolveWith } = options[operationName] || options;

        if (failWith) {
          observer.error(failWith);
        }

        observer.next({
          data: resolveWith
        });
        observer.complete();
      })
  );
}
