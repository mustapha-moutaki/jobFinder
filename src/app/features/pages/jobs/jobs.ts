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
  private readonly jobService = inject(JobService);
  private readonly authServce = inject(AuthService)
  
  jobs = signal<Job[]>([]);
  isLoading = signal(false);
  currentPage = signal(0);
  error = signal('');


  ngOnInit(): void {
    this.loadJobs(0);
    this.authServce.getCurrentUser();
  }

  curretUser(){
    return this.authServce.getCurrentUser();
  }

  loadJobs(page: number) {
    this.isLoading.set(true);
    this.error.set('');
    
    this.jobService.getAllJobs(page).subscribe({
      next: (res: any) => {

        this.jobs.set(res.data || []);
        
        this.currentPage.set(res.meta?.current_page || 0);
        
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set('Failed to load jobs');
        this.isLoading.set(false);
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

}