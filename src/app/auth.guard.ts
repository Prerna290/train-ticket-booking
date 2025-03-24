import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  CanActivate,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const isLoggedIn = this.authService.checkLoggedIn();
    const isAdmin = this.authService.checkIsAdmin();

    if (isLoggedIn && isAdmin) {
      return true;
    } else if (isLoggedIn) {
      this.router.navigate(['/home']);
      return false;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
