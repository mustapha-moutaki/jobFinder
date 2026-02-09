import { inject, Injectable } from "@angular/core";
import { JobApi } from "../../api/jobs.api";
import { Observable } from "rxjs";
import { Job, PageResponse } from "../models/job.model";

@Injectable({providedIn: 'root'})
export class JobService{
    private readonly jobApi = inject(JobApi);
    

    getAllJobs(page: number =0): Observable<PageResponse<Job>>{
         return this.jobApi.getAllJobs(page)
    }
}