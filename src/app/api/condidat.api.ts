import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment.development";
import { Condidat } from "../core/models/condidat.model";
import { catchError, Observable, of } from "rxjs";


@Injectable({providedIn: 'root'})
export class CondidatApi{
    private readonly http = inject(HttpClient);
    private readonly condidatsUrl = `${environment.localApi}/condidats`;


     // add to condidat
    addToCondidat(userId: number, jobSlug: string, title: string, company:string, location: string, url: string): Observable<Condidat|null>{
        const condidat:Condidat={
            userId,
            jobSlug,
            title,
            company,
            url: url || "unknown",
            location: location || 'unknown', 
            status:'pending',
            apiSource: 'arbeitnow',
            notes: 'No description',
            dateAdded: new Date().toISOString() 
        }

        return this.http.post<Condidat>(`${this.condidatsUrl}`, condidat).pipe(
            catchError(err=>{
                console.log("Failed to save in db", err);
                return of (null);
            })
        )
    }


   
    getCondidatsByUserId(id: number): Observable<Condidat[]> {
    // Correct way to filter in JSON Server: ?userId=1
    return this.http.get<Condidat[]>(`${this.condidatsUrl}?userId=${id}`);
}

updateCondidatStatus(id: number, status: string): Observable<Condidat> {
    // PATCH only updates the field you send
    return this.http.patch<Condidat>(`${this.condidatsUrl}/${id}`, { status });
}

addNoteToCondidat(id: number, notes: string): Observable<string>{
    return this.http.patch<string>(`${this.condidatsUrl}/${id}`, {notes})
}
}