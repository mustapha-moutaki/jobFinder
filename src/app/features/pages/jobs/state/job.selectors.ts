import { createFeatureSelector, createSelector } from '@ngrx/store';
import { JobState } from './job.reducer';

export const selectJobState = createFeatureSelector<JobState>('job');

export const selectFavoriteSlugs = createSelector(
  selectJobState,
  (state) => state.favoriteSlugs
);

export const selectIsLoadingFavorite = createSelector(
  selectJobState,
  (state) => state.loading
);