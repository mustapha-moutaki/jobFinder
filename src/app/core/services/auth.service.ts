import { inject, Injectable } from "@angular/core";
import { AuthApi } from "../../api/auth.api";
import { RegisterRequest } from "../models/auth.model";
import { Observable, tap } from "rxjs";
import * as bcrypt from 'bcryptjs';

@Injectable({providedIn: 'root'})
export class AuthService {
    private readonly authApi = inject(AuthApi);

    // register 
    register(data: RegisterRequest): Observable<any> {
       
        const dataToSend = { ...data };

        // hash password
        const salt = bcrypt.genSaltSync(10);
        dataToSend.password = bcrypt.hashSync(data.password, salt);

        const { password, ...userWithoutPassword } = data;
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));

        // send hashed password to backend
        return this.authApi.register(dataToSend);
    }
}
