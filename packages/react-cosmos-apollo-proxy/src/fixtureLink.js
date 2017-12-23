import { ApolloLink, Observable } from 'apollo-link';

export function createFixtureLink(options) {
  return new ApolloLink(
    () =>
      new Observable(observer => {
        if (options.failWith) {
          observer.error(options.failWith);
        }

        observer.next({
          data: options.resolveWith
        });
        observer.complete();
      })
  );
}
