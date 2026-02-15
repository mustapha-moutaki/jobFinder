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

  // --- 1. Data Signals ---
  jobs = signal<Job[]>([]); 
  isLoading = signal(false); 
  error = signal('');

  // --- 2. Filter Signals ---
  searchQuery = signal(''); // Title/Company
  cityQuery = signal('');   // Location/City
  visaFilter = signal(false);
  remoteFilter = signal(false);

  // --- 3. Pagination Signals ---
  localPage = signal(0);
  pageSize = signal(10);
  currentPage = signal(0); // Backend page tracker
  hasNextPage = signal(false);
  hasPrevPage = signal(false);

  private searchSubject = new Subject<string>();
  favoriteSlugs = this.store.selectSignal(JobSelectors.selectFavoriteSlugs);

  // --- 4. Search & Filter Logic (Organized) ---
  filteredJobs = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const city = this.cityQuery().toLowerCase().trim();
    
    return this.jobs().filter(job => {
      const matchesText = !query || job.title.toLowerCase().includes(query) || job.company_name.toLowerCase().includes(query);
      const matchesCity = !city || job.location.toLowerCase().includes(city);
      return matchesText && matchesCity;
    });
  });

  paginatedJobs = computed(() => {
    const start = this.localPage() * this.pageSize();
    return this.filteredJobs().slice(start, start + this.pageSize());
  });

  totalLocalPages = computed(() => Math.ceil(this.filteredJobs().length / this.pageSize()) || 1);

  ngOnInit(): void {
    this.loadJobs(0);
    const user = this.authServce.getCurrentUser(); 
    if (user?.id) this.store.dispatch(JobActions.loadFavorites({ userId: user.id }));

    // Debounce the main search input
    this.searchSubject.pipe(debounceTime(400), distinctUntilChanged()).subscribe(val => {
      this.searchQuery.set(val);
      this.localPage.set(0);
    });
  }

  // --- 5. Methods ---
  loadJobs(page: number) {
    this.isLoading.set(true);
    this.jobService.getAllJobs(page, this.visaFilter(), this.remoteFilter()).subscribe({
      next: (res: any) => {
        this.jobs.set(res.data || []);
        this.localPage.set(0);
        this.currentPage.set((res.meta?.current_page || 1) - 1);
        this.hasNextPage.set(!!res.links?.next);
        this.hasPrevPage.set(!!res.links?.prev);
        this.isLoading.set(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      error: () => this.isLoading.set(false)
    });
  }

  onSearch(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.searchSubject.next(val);
  }

  onCitySearch(event: Event) {
    const val = (event.target as HTMLInputElement).value;
    this.cityQuery.set(val); // Instant feedback for city search
    this.localPage.set(0);
  }

  nextLocalPage() {
    if (this.localPage() < this.totalLocalPages() - 1) this.localPage.update(p => p + 1);
    else if (this.hasNextPage()) this.loadJobs(this.currentPage() + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  prevLocalPage() {
    if (this.localPage() > 0) this.localPage.update(p => p - 1);
    else if (this.hasPrevPage()) this.loadJobs(this.currentPage() - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  toggleVisa() { this.visaFilter.update(v => !v); this.loadJobs(0); }
  toggleRemote() { this.remoteFilter.update(v => !v); this.loadJobs(0); }
  isFavorite(slug: string) { return this.favoriteSlugs().includes(slug); }
  curretUser() { return this.authServce.getCurrentUser(); }
  logout() { this.authServce.logout(); this.store.dispatch(JobActions.clearFavorites()); }

  addToFavorite(job: Job) {
    const user = this.curretUser();
    if (user && !this.isFavorite(job.slug)) {
      this.store.dispatch(JobActions.addToFavorite({
        userId: user.id!, jobSlug: job.slug, jobTitle: job.title, company: job.company_name
      }));
    }
  }
}