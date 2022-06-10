import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private router: Router;
  private authService: AuthService;

  constructor(authService: AuthService, router: Router) {
    this.router = router;
    this.authService = authService;
  }


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    console.log(this.checkLogin(state.url))
    return this.checkLogin(state.url);
  }

  checkLogin(url: string): true|UrlTree {
    if (this.authService.isLoggedIn()) {
      return true;
    }

    // Store the attempted URL for redirecting
    this.authService.redirectUrl = url;

    // Redirect to the login page
    return this.router.parseUrl('/login');
  }

}
