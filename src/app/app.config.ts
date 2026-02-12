import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngrx/store';
import { jobReducer } from './features/pages/jobs/state/job.reducer';
import { provideEffects } from '@ngrx/effects';
import { JobEffects } from'./features/pages/jobs/state/job.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideStore({
       job: jobReducer
    }),
    provideEffects([JobEffects])
]
};
