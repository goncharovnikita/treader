import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { User } from '@firebase/auth-types';

@Injectable()
export class AuthService {
  constructor(
    private $fireAuth: AngularFireAuth,
    private $router: Router
  ) {}

  fetchAuthState(): Observable<User> {
    return this.$fireAuth.authState;
  }

  /**
   * Sign in via specified method
   * @param method method type
   */
  login(method: string) {
    console.log(`Login via ${method}`);
    switch (method) {
      case 'google':
        this.$fireAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then(_ => {
          this.$router.navigate(['/home']);
        });
        break;
      default: return;
    }
  }

  logout() {
    this.$fireAuth.auth.signOut().then(_ => {
      console.log('navigate login from auth service')
      this.$router.navigate(['/hello']);
    });
  }
}
