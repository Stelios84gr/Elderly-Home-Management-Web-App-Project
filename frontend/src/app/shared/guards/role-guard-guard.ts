import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { StaffService } from '../services/staff-service';

export const roleGuardGuard: CanActivateFn = (route, state) => {
  const staffService = inject(StaffService);
  const router = inject(Router);

  const staff = staffService.staff$();

  // not logged in or token expired
  if (!staff || staffService.isTokenExpired()) {
    return router.parseUrl('/user-login');
  };

  // if roles include "ADMIN"
  if (staff.roles?.includes('ADMIN')) {
    return true;
  }

  return router.parseUrl('/restricted-content');
};
