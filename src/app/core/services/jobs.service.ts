import { inject, Injectable } from "@angular/core";
import { JobApi } from "../../api/jobs.api";
import { Observable, retry } from "rxjs";
import { Job, PageResponse } from "../models/job.model";

@Injectable({providedIn: 'root'})
export class JobService{
    private readonly jobApi = inject(JobApi); 
    
    getAllJobs(page: number = 1): Observable<PageResponse<Job>> { 
         return this.jobApi.getAllJobs(page); 
    }

    addToFavorite(data:any):Observable<void> {
        return this.jobApi.addToFavorite(data); 
    }

    getFavoritesByUserId(id: number): Observable<any[]> {
        return this.jobApi.getFavoritesByUserId(id);
    }
}