import { inject, Injectable } from "@angular/core";
import { AuthApi } from "../../api/auth.api";
import { LoginRequest, RegisterRequest, UserResponse } from "../models/auth.model";
import { map, Observable, tap } from "rxjs";
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

        return this.authApi.register(dataToSend);
    }


        // Login logic
    login(data: LoginRequest): Observable<UserResponse> {
        return this.authApi.getUserByEmail(data.email).pipe(
            map(users => {
                if (users.length === 0) {
                    throw new Error('User not found');
                }

                const user = users[0];

                // Verify hashed password
                const isPasswordValid = bcrypt.compareSync(data.password, user.password);

                if (!isPasswordValid) {
                    throw new Error('Invalid email or password');
                }

                // Return user data without password
                const { password, ...userWithoutPassword } = user;
                return userWithoutPassword;
            }),
            tap(userWithoutPassword => {
                localStorage.setItem('user', JSON.stringify(userWithoutPassword));
            })
        );
      }


      logout(): void {
        localStorage.removeItem('user');
    }

    getCurrentUser(): UserResponse | null {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }


}
