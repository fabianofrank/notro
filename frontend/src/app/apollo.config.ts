import { ApplicationConfig } from '@angular/core';
import { Apollo, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';

export function apolloOptionsFactory(httpLink: HttpLink) {
  return {
    cache: new InMemoryCache(),
    link: httpLink.create({
      uri: 'http://localhost:4000/graphql', // Backend GraphQL endpoint
    }),
    defaultOptions: {
      watchQuery: {
        errorPolicy: 'all',
      },
    },
  };
}

export const apolloConfig = {
  provide: APOLLO_OPTIONS,
  useFactory: apolloOptionsFactory,
  deps: [HttpLink],
};
