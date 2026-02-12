import { createReducer, on } from '@ngrx/store';
import * as JobActions from './job.actions';

export interface JobState {
  favoriteSlugs: string[];
  loading: boolean;
  error: any;
}

export const initialState: JobState = {
  favoriteSlugs: [],
  loading: false,
  error: null,
};

export const jobReducer = createReducer(
  initialState,
  // Load Favorites
  on(JobActions.loadFavoritesSuccess, (state, { slugs }) => ({
    ...state,
    favoriteSlugs: slugs
  })),

  // Add Favorite
  on(JobActions.addToFavorite, (state) => ({ 
    ...state, 
    loading: true 
  })),
  
  on(JobActions.addToFavoriteSuccess, (state, { jobSlug }) => ({
    ...state,
    favoriteSlugs: [...state.favoriteSlugs, jobSlug],
    loading: false
  })),
  
  on(JobActions.addToFavoriteFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error 
  })),

    on(JobActions.clearFavorites, (state) => ({
    ...state,
    favoriteSlugs: [],
    loading: false,
    error: null
  }))
);