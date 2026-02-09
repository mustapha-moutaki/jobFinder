import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment.development";
import { Observable } from "rxjs";
import { Job, PageResponse } from "../core/models/job.model";

@Injectable({providedIn: 'root'})
export class JobApi {
    private readonly http = inject(HttpClient);
    
    // URL for Arbeitnow (GET ONLY)
    private readonly publicUrl = `${environment.publicApi}`;

    private readonly localUrl = `${environment.localApi}`;

    getAllJobs(page: number = 1): Observable<PageResponse<Job>> {
        const params = new HttpParams().set('page', page.toString());
        return this.http.get<PageResponse<Job>>(this.publicUrl, { params });
    }

    // Change the URL here to point to localUrl
    addToFavorite(data: {userId: number, jobSlug: string}): Observable<void> {
        return this.http.post<void>(`${this.localUrl}/favorites`, data);
    }
}