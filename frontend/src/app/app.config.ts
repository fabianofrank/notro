import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { Apollo, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/core';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideHttpClient(),
    provideAnimations(),
    Apollo,
    HttpLink,
    {
      provide: APOLLO_OPTIONS,
      useFactory: (httpLink: HttpLink) => {
        const isProduction = window.location.hostname !== 'localhost';
        const graphqlUri = isProduction 
          ? `${window.location.origin}/graphql`
          : 'http://localhost:4000/graphql';
          
        return {
          cache: new InMemoryCache(),
          link: httpLink.create({
            uri: graphqlUri,
          }),
        };
      },
      deps: [HttpLink],
    }
  ]
};
