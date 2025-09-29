import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { StaffService } from 'src/app/shared/services/staff-service';
import { Auth } from 'src/app/shared/interfaces/auth';
import { jwtDecode } from 'jwt-decode';
import { ActivatedRoute, Router } from '@angular/router';
import { LoggedInStaffMember } from 'src/app/shared/interfaces/staff-member';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    CommonModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class StaffLogin implements OnInit {
  staffService = inject(StaffService);
  router = inject(Router);
  route = inject(ActivatedRoute);

  form = new FormGroup({
    username: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
  });

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const accessToken = params['token'];
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
        try {
          const decodedTokenSubject = jwtDecode(accessToken) as unknown as LoggedInStaffMember;

          //update staff signal
          this.staffService.staff$.set({
            username: decodedTokenSubject.username,
            roles: decodedTokenSubject.roles,
          });

          this.router.navigate(['/']);
        } catch (err) {
          console.error('Invalid or expired token:', err);

          // remove bad token
          localStorage.removeItem('accessToken');

          this.router.navigate(['/login']);
        }
      }
    });
  }

  onSubmit() {
    console.log(this.form.value);
    // const credentials = this.form.value as Auth;
    const credentials: Auth = {
      username: (this.form.value.username ?? '').trim(),
      password: this.form.value.password ?? '',
    };

    this.staffService.loginStaffMember(credentials).subscribe({
      next: (response) => {
        console.log('Successful Login', response);
        const accessToken = response.data;
        localStorage.setItem('accessToken', accessToken);

        const decodedTokenSubject = jwtDecode(accessToken) as unknown as LoggedInStaffMember;
        console.log(decodedTokenSubject);

        // assign access token payload contents to signal variable staff$
        this.staffService.staff$.set({
          username: decodedTokenSubject.username,
          roles: decodedTokenSubject.roles,
        });
        console.log('Signal:', this.staffService.staff$());

        this.router.navigate(['/']);
      },
    });
  }

  googleLogin() {
    this.staffService.redirectToGoogleLogin();
  }
};
