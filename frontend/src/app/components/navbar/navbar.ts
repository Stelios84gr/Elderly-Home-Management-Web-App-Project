import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { StaffService } from 'src/app/shared/services/staff-service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, MatToolbarModule, MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css']
})
export class Navbar {
  router = inject(Router);
  staffService = inject(StaffService);

  // private: automatic Router instance injection
  // constructor(private router: Router) {};

  goToLogin() {
    this.router.navigate(['/login']);
  };

  logout() {
    this.staffService.logoutStaffMember();
  };
};
