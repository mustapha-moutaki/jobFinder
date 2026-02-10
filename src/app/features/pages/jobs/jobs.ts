import { Component, inject, OnInit, signal } from '@angular/core';
import { JobService } from '../../../core/services/jobs.service';
import { Job } from '../../../core/models/job.model';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [
     CommonModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule
  ],
  templateUrl: './jobs.html'
})
export class Jobs implements OnInit {
  private readonly jobService = inject(JobService); // CHANGE: keep injected JobService reference
  private readonly authServce = inject(AuthService); // CHANGE: keep injected AuthService reference

  jobs = signal<Job[]>([]); // CHANGE: keep list of jobs as a reactive signal
  isLoading = signal(false); // CHANGE: track loading state for pagination and UI feedback
  currentPage = signal(0); // CHANGE: use 1-based page index to match the API
  // CHANGE: replaced totalPages with simple next/prev flags for easier pagination
  hasNextPage = signal(false); // CHANGE: true when API response contains a next page link
  hasPrevPage = signal(false); // CHANGE: true when API response contains a previous page link
  error = signal(''); // CHANGE: keep error message for failed job loads


  ngOnInit(): void {
    this.loadJobs(1); // CHANGE: start from page 1 because the backend API is 1-based
    this.authServce.getCurrentUser(); // CHANGE: ensure current user is loaded when jobs page is initialized
  }

  curretUser(){
    return this.authServce.getCurrentUser();
  }

  loadJobs(page: number) {
    this.isLoading.set(true); // CHANGE: set loading state before requesting jobs
    this.error.set(''); // CHANGE: clear previous error message on each new load
    
    this.jobService.getAllJobs(page).subscribe({
      next: (res: any) => {

        this.jobs.set(res.data || []); // CHANGE: store jobs list from backend response
        this.currentPage.set(res.meta?.current_page || page); // CHANGE: sync current page with backend meta
        this.hasNextPage.set(!!res.links?.next); // CHANGE: enable next button only if backend provides next link
        this.hasPrevPage.set(!!res.links?.prev); // CHANGE: enable previous button only if backend provides prev link
        this.isLoading.set(false); // CHANGE: clear loading state when response arrives
      },
      error: (err) => {
        this.error.set('Failed to load jobs'); // CHANGE: show generic error message on failure
        this.isLoading.set(false); // CHANGE: clear loading state even when there is an error
      }
    });
  }

  private readonly idUser =  this.curretUser()?.id;

  // add to favorite
    addToFavorite(job: Job) {
    const user = this.curretUser();
    
    if (!user || !user.id) {
      alert("Please login to save favorites");
      return;
    }

    // We store the user ID and the job slug (unique identifier from the API)
    const favJob = {
      userId: user.id,
      jobSlug: job.slug,
      jobTitle: job.title, // Optional: store title to display in favorite list later
      company: job.company_name
    };

    this.jobService.addToFavorite(favJob).subscribe({
      next: () => {
        alert("Saved to your local favorites!");
      },
      error: (err: any) => {
        console.error("Make sure your json-server is running on port 3000", err);
        alert("Could not save to local server.");
      }
    });
  }

    


  nextPage() {
    if (this.hasNextPage() && !this.isLoading()) { // CHANGE: only go next if backend reports a next page and not loading
      this.loadJobs(this.currentPage() + 1); // CHANGE: move to next 1-based page
    }
  }

  prevPage() {
    if (this.hasPrevPage() && !this.isLoading()) { // CHANGE: only go previous if backend reports a previous page and not loading
      this.loadJobs(this.currentPage() - 1); // CHANGE: move to previous 1-based page
    }
  }


  logout():void{
    this.authServce.logout();
    console.log("logout successfully")
  }

}