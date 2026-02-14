import { inject, Injectable } from "@angular/core";
import { JobService } from "./jobs.service";
import { Observable } from "rxjs";
import { favoriteApi } from "../../api/favorite.api";

@Injectable({providedIn: 'root'})
export class favoriteService{
    private readonly favoriteApi = inject(favoriteApi);


   
       addToFavorite(data:any):Observable<void> {
           return this.favoriteApi.addToFavorite(data); 
       }
   
       
       // return  favorite job by userId
       getFavoritesByUserId(id: number): Observable<any[]> {
           return this.favoriteApi.getFavoritesByUserId(id);
       }


        removeFavorite(id: number):Observable<any>{
        return this.favoriteApi.removeFavorite(id);
    }
}