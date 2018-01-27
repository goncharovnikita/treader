import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable()
export class HelloPageGuard implements CanActivate {
  constructor(
    private $auth: AuthService,
    private $router: Router
  ) {}

  canActivate(): Observable<boolean> {
    return this.$auth.fetchAuthState()
      .map(v => {
        if (!v) {
          return true;
        }
        console.log('navigate home');
        this.$router.navigate(['/home']);
        return false;
      });
  }
}
