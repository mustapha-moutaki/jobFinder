import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { JobService } from '../../../core/services/jobs.service';
import { Job } from '../../../core/models/job.model';

@Component({
  selector: 'app-job-details',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './job-details.html',
  styles: [`
    /* Custom styles for the HTML description injected from API */
    :host ::ng-deep .description-content ul { list-style: disc; margin-left: 1.5rem; margin-bottom: 1rem; }
    :host ::ng-deep .description-content p { margin-bottom: 1rem; }
    :host ::ng-deep .description-content h2 { font-size: 1.5rem; font-weight: 800; margin-top: 2rem; margin-bottom: 1rem; }
  `]
})
export class JobDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private jobService = inject(JobService);

  job = signal<Job | null>(null);
  isLoading = signal(true);

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.jobService.getJobBySlug(slug).subscribe({
        next: (data) => {
          this.job.set(data || null);
          this.isLoading.set(false);
        },
        error: () => this.isLoading.set(false)
      });
    }
  }


  // hna bghina n mchiw seet oficial dyalhom but in new window

  openApply(url: string | undefined) {
    if (url) window.open(url, '_blank');
  }
}