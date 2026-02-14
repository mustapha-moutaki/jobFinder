import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { favoriteService } from '../../../../core/services/favorite.service';
import * as JobActions from './job.actions';
import { catchError, map, mergeMap, of } from 'rxjs';

@Injectable()
export class JobEffects {
  private actions$ = inject(Actions);
  private favoriteService = inject(favoriteService);

  // Effect to load favorites from API
  loadFavorites$ = createEffect(() =>
    this.actions$.pipe(
      ofType(JobActions.loadFavorites),
      mergeMap(({ userId }) =>
        this.favoriteService.getFavoritesByUserId(userId).pipe(
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
        this.favoriteService.addToFavorite({
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