import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { User } from '../../../core/models/user.model';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Navigation, Router } from '@angular/router';
@Component({
  selector: 'app-user-details',
  standalone: true, // Make sure this is here
  imports: [
       CommonModule, 
    ReactiveFormsModule, 
    MatInputModule, 
    MatButtonModule, 
    MatCardModule
  ],
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
    password: [''] 
  });


   private readonly router = inject(Router)
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
  if (!user || !user.id) return;

  const formValue = this.form.getRawValue();

  this.userService.editAccount(user.id, formValue).subscribe({
    next: (updatedUserFromServer) => {
      console.log("1. Server Updated:", updatedUserFromServer);

      this.userService.updateStoredUser(updatedUserFromServer);

      this.form.get('password')?.reset();

      alert("Profile updated successfully!");
      console.log("2. LocalStorage Sync Complete.");
    },
    error: (err) => console.error("Update failed", err)
  });
}





deleteMyAccount(){
 
   const userId = Number(this.authService.getCurrentUser()?.id)
    if(!userId) return ;

  this.userService.deleteAccount(userId).subscribe({
    next: ()=>{
      console.log("account deleted successfully")
     console.log("Good bye, we gonna miss u");
     localStorage.removeItem('user');
      setTimeout(()=>{
      this,this.router.navigate(['/'])
      }, 2000)
     
    },
    error: (err)=>{
      console.log("Failed to delete account", err)
    }
  })
}
}