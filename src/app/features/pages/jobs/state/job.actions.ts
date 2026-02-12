import { createAction, props } from '@ngrx/store';

// Loading initial favorites
export const loadFavorites = createAction(
  '[Jobs] Load Favorites',
  props<{ userId: number }>()
);

export const loadFavoritesSuccess = createAction(
  '[Jobs] Load Favorites Success',
  props<{ slugs: string[] }>()
);

// Adding a favorite
export const addToFavorite = createAction(
  '[Jobs] Add To Favorite',
  props<{ userId: number; jobSlug: string; jobTitle: string; company: string }>()
);

export const addToFavoriteSuccess = createAction(
  '[Jobs] Add To Favorite Success',
  props<{ jobSlug: string }>()
);

export const addToFavoriteFailure = createAction(
  '[Jobs] Add To Favorite Failure',
  props<{ error: any }>()
);


export const clearFavorites = createAction('[Jobs] Clear Favorites');