import { inject, Injectable } from "@angular/core";
import { AuthApi } from "../../api/auth.api";
import { RegisterRequest } from "../models/auth.model";
import { Observable, tap } from "rxjs";

@Injectable({providedIn: 'root'})

export class AuthService{
    private readonly authApi = inject(AuthApi);



    // register 
    register(data: RegisterRequest): Observable<any> {
    return this.authApi.register(data).pipe(
      tap(() => {
        localStorage.setItem('user', JSON.stringify(data));
      })
    );
  }

}