import { HttpClient, HttpParams } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment.development";
import { catchError, Observable, of, retry } from "rxjs";
import { Job, PageResponse } from "../core/models/job.model";
import { Condidat } from "../core/models/condidat.model";

@Injectable({providedIn: 'root'})
export class JobApi {
    private readonly http = inject(HttpClient);
    
 
    private readonly publicUrl = `${environment.publicApi}`;

    private readonly localUrl = `${environment.localApi}`;


    // get all jobs
    getAllJobs(page: number = 1, visa:boolean, remote:boolean): Observable<PageResponse<Job>> {
        let params = new HttpParams().set('page', page.toString());
        if(visa){
            params = params.set('visa_sponsorship', 'true')
        }if(remote){
            params =  params.set('remote', 'true')
        }
        
        return this.http.get<PageResponse<Job>>(this.publicUrl, { params });
    }

    // // add to favorite
    // addToFavorite(data: {userId: number, jobSlug: string}): Observable<void> {
    //     return this.http.post<void>(`${this.localUrl}/favorites`, data);
    // }


    // // get favorite by user id
    //  getFavoritesByUserId(userId: number): Observable<any[]> {
    //     return this.http.get<any[]>(`${this.localUrl}/favorites?userId=${userId}`);
    // }

   

    

}