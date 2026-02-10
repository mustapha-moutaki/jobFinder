import { inject, Injectable } from "@angular/core";
import { JobApi } from "../../api/jobs.api";
import { Observable, retry } from "rxjs";
import { Job, PageResponse } from "../models/job.model";

@Injectable({providedIn: 'root'})
export class JobService{
    private readonly jobApi = inject(JobApi); // CHANGE: keep injected JobApi reference
    
    getAllJobs(page: number = 1): Observable<PageResponse<Job>> { // CHANGE: default to page 1 to match backend API (1-based)
         return this.jobApi.getAllJobs(page); // CHANGE: forward pagination page to JobApi
    }

    addToFavorite(data:any):Observable<void> {
        return this.jobApi.addToFavorite(data); // CHANGE: forward favorite payload to JobApi
    }
}