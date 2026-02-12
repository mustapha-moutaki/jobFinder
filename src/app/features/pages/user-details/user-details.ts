import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { User } from '../../../core/models/user.model';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-user-details',
  standalone: true, // Make sure this is here
  imports: [ReactiveFormsModule, MatCardModule, MatInputModule,  MatButtonModule],
  templateUrl: './user-details.html',
  styleUrl: './user-details.css',
})
export class UserDetails implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly authService = inject(AuthService);

  form = this.fb.nonNullable.group({
    firstName: [''],
    lastName: [''],
    email: ['', [Validators.email]],
    password: [''] // Leave empty, only fill if user wants to change it
  });

  ngOnInit(): void {
    // Fill the form with current data so we don't send empty fields
    const currentUser = this.authService.getCurrentUser();
    if (currentUser) {
      this.form.patchValue({
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email
      });
    }
  }

 onSubmit(): void {
  const user = this.authService.getCurrentUser();
  
  console.log("DEBUG: Full User Object from Auth:", user);
  
  if (!user) {
    console.error("DEBUG: No user found in storage!");
    return;
  }

  if (user.id === undefined || user.id === null) {
    console.error("DEBUG: User exists, but the ID property is missing or undefined!");
    console.log("DEBUG: Available keys in user object:", Object.keys(user));
    return;
  }

  const formValue = this.form.getRawValue();
  this.userService.editAccount(user.id, formValue).subscribe({
    next: () => console.log("Update Success!"),
    error: (err) => console.error("Update Failed:", err)
  });
}
}