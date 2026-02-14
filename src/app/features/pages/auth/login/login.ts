import { Component, inject, Injectable } from "@angular/core";
import { AuthService } from "../../../../core/services/auth.service";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { CommonModule } from "@angular/common";
import { Router, RouterLink } from "@angular/router";
import { MatCardModule } from "@angular/material/card";
import { MatInputModule } from "@angular/material/input";
import { UserResponse } from "../../../../core/models/auth.model";


@Component({
    standalone: true,
    selector: 'app-login',
    imports: [ReactiveFormsModule, MatCardModule, MatInputModule, RouterLink],
    templateUrl: './login.html'
})

export class Login{
    private readonly authService = inject(AuthService);
    private readonly fb = inject(FormBuilder);
    private readonly router = inject(Router);

    loading = false;
    error = '';

    form = this.fb.nonNullable.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]]
    })

    // login.ts
submit(): void {
    if (this.form.invalid) return;

    this.loading = true;
    this.error = '';

    this.authService.login(this.form.getRawValue()).subscribe({
        next: (userData: UserResponse) => {
            this.loading = false;
            console.log("Logged in user:", userData); 
            this.router.navigate(['/']); 
        },
        error: (err) => {
            this.loading = false;
            this.error = err.message || 'Login failed';
            console.error("Security: Login attempt failed. No data stored.");
        }
    });
}
}