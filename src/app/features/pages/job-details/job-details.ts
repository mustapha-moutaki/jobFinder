import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { JobService } from '../../../core/services/jobs.service';
import { Job } from '../../../core/models/job.model';
import { Condidat } from '../../../core/models/condidat.model';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-job-details',
  standalone: true,
  imports: [CommonModule, RouterLink, DatePipe],
  templateUrl: './job-details.html',
  styles: [`
    :host ::ng-deep .description-content ul { list-style: disc; margin-left: 1.5rem; margin-bottom: 1rem; }
    :host ::ng-deep .description-content p { margin-bottom: 1rem; }
    :host ::ng-deep .description-content h2 { font-size: 1.5rem; font-weight: 800; margin-top: 2rem; margin-bottom: 1rem; }
  `]
})
export class JobDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private jobService = inject(JobService);
  private authService = inject(AuthService);

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

  

  openApply(job: Job | null){
    if(!job) return ;
    const currentUser = this.authService.getCurrentUser();

    if(!currentUser){
      console.log("user not logged in");
      return ;
    }

    this.jobService.addToCondidat(currentUser.id!, job.slug, job.title, job.company_name, job.location, job.url).subscribe({
      next: ()=>{
        console.log("the condidat saved");
        setTimeout(()=>{
          console.log("redirecting ...");
         window.open(job.url, '_blank');
        })
      }, error: (err)=>[
        console.log("failed to save the condidat", err)
      ]
    })
  }
}