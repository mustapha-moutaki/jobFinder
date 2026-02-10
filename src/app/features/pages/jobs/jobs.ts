import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { JobService } from '../../../core/services/jobs.service';
import { Job } from '../../../core/models/job.model';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../../core/services/auth.service';
import { RouterLink } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatInputModule, RouterLink],
  templateUrl: './jobs.html'
})
export class Jobs implements OnInit {
  private readonly jobService = inject(JobService); 
  private readonly authServce = inject(AuthService);

  // Raw data from API
  jobs = signal<Job[]>([]); 
  isLoading = signal(false); 
  currentPage = signal(0);
  
  // Filters and Search
  visaFilter = signal(false);
  remoteFilter = signal(false);
  searchQuery = signal('');
  private searchSubject = new Subject<string>();
  
  favoriteSlugs = signal<string[]>([]);
  hasNextPage = signal(false);
  hasPrevPage = signal(false);
  error = signal('');

  // FILTER LOGIC: This updates automatically when jobs() or searchQuery() changes
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
    this.authServce.getCurrentUser(); 
    this.loadUserFavorites(); 

    // DEBOUNCE LOGIC
    this.searchSubject.pipe(
      debounceTime(500), // Changed from 3000ms to 500ms for better UX
      distinctUntilChanged()
    ).subscribe(value => {
      this.searchQuery.set(value); 
      // NOTE: We do NOT call loadJobs(0) here because the API cannot filter.
      // The 'filteredJobs' computed signal handles the UI update.
    });
  }

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchSubject.next(input.value);
  }

  loadJobs(page: number) {
    this.isLoading.set(true);
    // API only handles page and boolean filters
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

  loadUserFavorites() {
    const user = this.curretUser();
    if (user && user.id) {
      this.jobService.getFavoritesByUserId(user.id).subscribe({
        next: (favs: any[]) => { 
          const slugs = favs.map(f => f.jobSlug);
          this.favoriteSlugs.set(slugs);
        }
      });
    }
  }

  curretUser() {
    return this.authServce.getCurrentUser();
  }

  isFavorite(slug: string): boolean {
    return this.favoriteSlugs().includes(slug);
  }

  toggleVisa() {
    this.visaFilter.update(v => !v);
    this.loadJobs(0); 
  }

  toggleRemote() {
    this.remoteFilter.update(v => !v);
    this.loadJobs(0); 
  }

  nextPage() {
    if (this.hasNextPage() && !this.isLoading()) {
      this.loadJobs(this.currentPage() + 1); 
    }
  }

  prevPage() {
    if (this.hasPrevPage() && !this.isLoading()) {
      this.loadJobs(this.currentPage() - 1);
    }
  }

  addToFavorite(job: Job) {
    const user = this.curretUser();
    if (!user || this.isFavorite(job.slug)) return;

    const favJob = {
      userId: user.id,
      jobSlug: job.slug,
      jobTitle: job.title,
      company: job.company_name
    };

    this.jobService.addToFavorite(favJob).subscribe({
      next: () => {
        this.favoriteSlugs.update(prev => [...prev, job.slug]);
      }
    });
  }

  logout(): void {
    this.authServce.logout();
    this.favoriteSlugs.set([]); 
  }
}