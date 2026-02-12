import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { JobService } from '../../../../core/services/jobs.service';
import * as JobActions from './job.actions';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class JobEffects {
  private actions$ = inject(Actions);
  private jobService = inject(JobService);

  // Effect to load favorites from API
  loadFavorites$ = createEffect(() =>
    this.actions$.pipe(
      ofType(JobActions.loadFavorites),
      mergeMap(({ userId }) =>
        this.jobService.getFavoritesByUserId(userId).pipe(
          map((favs: any[]) => {
            const slugs = favs.map(f => f.jobSlug);
            return JobActions.loadFavoritesSuccess({ slugs });
          })
        )
      )
    )
  );

  // Effect to add a favorite to API
  addToFavorite$ = createEffect(() =>
    this.actions$.pipe(
      ofType(JobActions.addToFavorite),
      mergeMap((action) =>
        this.jobService.addToFavorite({
          userId: action.userId,
          jobSlug: action.jobSlug,
          jobTitle: action.jobTitle,
          company: action.company
        }).pipe(
          map(() => JobActions.addToFavoriteSuccess({ jobSlug: action.jobSlug })),
          catchError((error) => of(JobActions.addToFavoriteFailure({ error })))
        )
      )
    )
  );
}