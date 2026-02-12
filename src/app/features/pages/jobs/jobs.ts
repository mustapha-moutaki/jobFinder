import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { JobService } from '../../../core/services/jobs.service';
import { Job } from '../../../core/models/job.model';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../../core/services/auth.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

// NgRx Imports
import { Store } from '@ngrx/store';
import * as JobActions from './state/job.actions';
import * as JobSelectors from './state/job.selectors';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatInputModule, RouterLink, RouterLinkActive],
  templateUrl: './jobs.html'
})
export class Jobs implements OnInit {
  private readonly jobService = inject(JobService); 
  private readonly authServce = inject(AuthService);
  private readonly store = inject(Store); 

  // 1. STATE MANAGEMENT: Connect selectors to Signals
  favoriteSlugs = this.store.selectSignal(JobSelectors.selectFavoriteSlugs);
  isAddingFavorite = this.store.selectSignal(JobSelectors.selectIsLoadingFavorite);

  jobs = signal<Job[]>([]); 
  isLoading = signal(false); 
  currentPage = signal(0);
  visaFilter = signal(false);
  remoteFilter = signal(false);
  searchQuery = signal('');
  private searchSubject = new Subject<string>();
  
  hasNextPage = signal(false);
  hasPrevPage = signal(false);
  error = signal('');

  filteredJobs = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const allJobs = this.jobs();
    if (!query) return allJobs; 
    return allJobs.filter(job => 
      job.title.toLowerCase().includes(query) || 
      job.company_name.toLowerCase().includes(query)
    );
  });

  ngOnInit(): void {
    this.loadJobs(0); 

    // 2. STATE MANAGEMENT: Load initial favorites from DB via NgRx
    const user = this.authServce.getCurrentUser(); 
    if (user?.id) {
      this.store.dispatch(JobActions.loadFavorites({ userId: user.id }));
    }

    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe(value => {
      this.searchQuery.set(value); 
    });
  }

  // 3. STATE MANAGEMENT: Modified function to use dispatch
  addToFavorite(job: Job) {
    const user = this.curretUser();
    if (!user || this.isFavorite(job.slug)) return;

    // Dispatch the action to trigger the Effect and Reducer
    this.store.dispatch(JobActions.addToFavorite({
      userId: user.id!,
      jobSlug: job.slug,
      jobTitle: job.title,
      company: job.company_name
    }));
  }

  // 4. STATE MANAGEMENT: Logic now uses the Store-linked Signal
  isFavorite(slug: string): boolean {
    return this.favoriteSlugs().includes(slug);
  }

  // Helper Methods
  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchSubject.next(input.value);
  }

  loadJobs(page: number) {
    this.isLoading.set(true);
    this.jobService.getAllJobs(page, this.visaFilter(), this.remoteFilter()).subscribe({
      next: (res: any) => {
        this.jobs.set(res.data || []); 
        const backendPage = res.meta?.current_page;
        this.currentPage.set(backendPage !== undefined ? backendPage - 1 : page);
        this.hasNextPage.set(!!res.links?.next);
        this.hasPrevPage.set(!!res.links?.prev); 
        this.isLoading.set(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: () => {
        this.error.set('Failed to load jobs'); 
        this.isLoading.set(false); 
      }
    });
  }

  curretUser() {
    return this.authServce.getCurrentUser();
  }

  toggleVisa() { this.visaFilter.update(v => !v); this.loadJobs(0); }
  toggleRemote() { this.remoteFilter.update(v => !v); this.loadJobs(0); }
  nextPage() { if (this.hasNextPage() && !this.isLoading()) this.loadJobs(this.currentPage() + 1); }
  prevPage() { if (this.hasPrevPage() && !this.isLoading()) this.loadJobs(this.currentPage() - 1); }

  logout(): void {
    this.authServce.logout();
     this.store.dispatch(JobActions.clearFavorites());
  }
}