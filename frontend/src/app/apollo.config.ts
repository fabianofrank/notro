import { ApplicationConfig } from '@angular/core';
import { Apollo, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';

export function apolloOptionsFactory(httpLink: HttpLink) {
  const isProduction = typeof window !== 'undefined' && 
    window.location.hostname !== 'localhost';
  
  const graphqlUri = isProduction 
    ? 'https://notro-challenge.vercel.app/api/graphql'
    : 'http://localhost:4000/graphql';
    
  return {
    cache: new InMemoryCache(),
    link: httpLink.create({
      uri: graphqlUri, // Backend GraphQL endpoint
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
