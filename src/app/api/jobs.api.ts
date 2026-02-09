import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment.development";
import { Observable } from "rxjs";
import { Job, PageResponse } from "../core/models/job.model";

@Injectable({providedIn: 'root'})

export class JobApi{
    private readonly http = inject(HttpClient);
    private readonly baseUrl = `${environment.publicApi}`;

    getAllJobs(page: number =0): Observable<PageResponse<Job>>{
             const params = new HttpParams().set('page', page.toString());
            
            return this.http.get<PageResponse<Job>>(this.baseUrl, { params });
        }
}