import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { environment } from "../../environments/environment.development";
import { RegisterRequest } from "../core/models/auth.model";
import { Observable } from "rxjs";

@Injectable({providedIn: 'root'})

export class AuthApi{
    private readonly http = inject(HttpClient);
    private readonly baseUrl = `${environment.localApi}/users`;


    // register
    register(data: RegisterRequest): Observable<void>{
        return this.http.post<void>(`${this.baseUrl}`, data);
    }
    

}