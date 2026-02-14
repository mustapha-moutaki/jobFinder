import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment.development";
import { Observable } from "rxjs";
@Injectable({ providedIn: 'root' }) 
export class favoriteApi{
    private readonly http = inject(HttpClient);

    private readonly favoriteUrl = `${environment.localApi}/favorites`;

     // add to favorite
    addToFavorite(data: {userId: number, jobSlug: string}): Observable<void> {
        return this.http.post<void>(this.favoriteUrl, data);
    }


    // get favorite by user id
     getFavoritesByUserId(userId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.favoriteUrl}?userId=${userId}`);
    }


    removeFavorite(id: number):Observable<any>{
        return this.http.delete<void>(`${this.favoriteUrl}/${id}`);
    }

}