import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { FormBuilder, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterLink } from '@angular/router';
import { Login } from '../login/login';

@Component({
  standalone: true,
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {

  private readonly authService = inject(AuthService);

  private readonly fb = inject(FormBuilder);

  private readonly router = inject(Router)

   form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  loading = false;
  error:string = "";

  submit():void{
    if(this.form.invalid) return;
    this.loading =true;
    this.authService.register(this.form.getRawValue()).subscribe({
      next: ()=>{
        this.loading = false;
        this.error = '';
        this.router.navigate(['/login']);
      },
      error: ()=>{
        this.loading = false;
        this.error = "register Failed";
      }
    })
  }

}
