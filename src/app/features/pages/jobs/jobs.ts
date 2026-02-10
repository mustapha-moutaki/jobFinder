import { Component, inject, OnInit, signal } from '@angular/core';
import { JobService } from '../../../core/services/jobs.service';
import { Job } from '../../../core/models/job.model';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../../core/services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatInputModule, RouterLink],
  templateUrl: './jobs.html'
})
export class Jobs implements OnInit {
  private readonly jobService = inject(JobService); 
  private readonly authServce = inject(AuthService);

  jobs = signal<Job[]>([]); 
  isLoading = signal(false); 
  currentPage = signal(0);
  
   // Filter signals
  visaFilter = signal(false);
  remoteFilter = signal(false);
  
  favoriteSlugs = signal<string[]>([]);
  
  hasNextPage = signal(false);
  hasPrevPage = signal(false);
  error = signal('');

  ngOnInit(): void {
    this.loadJobs(0); // Loading page 0 as per your backend
    this.authServce.getCurrentUser(); 
    this.loadUserFavorites(); 
  }

  curretUser() {
    return this.authServce.getCurrentUser();
  }

 

  loadUserFavorites() {
  const user = this.curretUser();
  if (user && user.id) {
    this.jobService.getFavoritesByUserId(user.id).subscribe({
      next: (favs: any[]) => { 
        const slugs = favs.map(f => f.jobSlug);
        this.favoriteSlugs.set(slugs);
      },
      error: (err) => console.error(err)
    });
  }
}

  isFavorite(slug: string): boolean {
    return this.favoriteSlugs().includes(slug);
  }

  loadJobs(page: number) {
    this.isLoading.set(true);
    this.jobService.getAllJobs(page).subscribe({
      next: (res: any) => {
        this.jobs.set(res.data || []); 
        this.currentPage.set(res.meta?.current_page || page);
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

  addToFavorite(job: Job) {
    const user = this.curretUser();
    if (!user) {
      alert("Please login to save favorites");
      return;
    }

    // Check if already favorite to prevent duplicates
    if (this.isFavorite(job.slug)) return;

    const favJob = {
      userId: user.id,
      jobSlug: job.slug,
      jobTitle: job.title,
      company: job.company_name
    };

    this.jobService.addToFavorite(favJob).subscribe({
      next: () => {
        // Update local signal so heart turns red immediately in UI
        this.favoriteSlugs.update(prev => [...prev, job.slug]);
      }
    });

    
  }

  // paginatio 

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

  logout(): void {
    this.authServce.logout();
    this.favoriteSlugs.set([]); 
  }








//   remoteFilter(){}
//   toggleRemote(){}
//  visaFilter(){}
//  toggleVisa(){}
}