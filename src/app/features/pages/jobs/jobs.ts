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


  // add to favorite
  addToFavorite(){
    return ''
  }
}