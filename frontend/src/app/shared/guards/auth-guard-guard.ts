import { CanActivateFn, Router } from '@angular/router';
import { inject, Inject } from '@angular/core';
import { StaffService } from '../services/staff-service';

export const authGuardGuard: CanActivateFn = (route, state) => {
  // without const only in classes
  const staffService = inject(StaffService)
  const router = inject(Router);

  if (staffService.staff$() && !staffService.isTokenExpired()) {
    return true;
  };

  return router.parseUrl('/user-login');
};
