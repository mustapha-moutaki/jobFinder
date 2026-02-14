import { inject, Injectable } from "@angular/core";
import { JobApi } from "../../api/jobs.api";
import { map, Observable, retry } from "rxjs";
import { Job, PageResponse } from "../models/job.model";
import { Condidat } from "../models/condidat.model";

@Injectable({providedIn: 'root'})
export class JobService{
    private readonly jobApi = inject(JobApi); 
    
    getAllJobs(page: number = 1, visa:boolean=false, remote:boolean=false ): Observable<PageResponse<Job>> { 
         return this.jobApi.getAllJobs(page, visa, remote); 
    }


     
    getJobBySlug(slug: string) {
  return this.jobApi.getAllJobs(0, false, false).pipe(
    map(response => response.data.find(job => job.slug === slug))
  );

  }



  

    
}

