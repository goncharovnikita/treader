import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { User } from '@firebase/auth-types';
import { isNullOrUndefined } from 'util';

@Injectable()
export class AuthService {
  constructor(
    private $fireAuth: AngularFireAuth,
    private $router: Router,
    private $http: HttpClient
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
      console.log('navigate login from auth service');
      this.$router.navigate(['/hello']);
    });
  }

  get(url: string, options: {} = {}): Observable<any> {
    return this.fetchAuthState()
      .switchMap(user => {
        options = Object.assign(options, {headers: {'user-id': user.uid}});
        return this.$http.get(url, options);
      });
  }

  post(url: string, body: any, options: {} = {}): Observable<any> {
    return this.fetchAuthState().filter(v => !isNullOrUndefined(v))
      .switchMap(user => {
        options = Object.assign(options, {headers: {'user-id': user.uid}});
        return this.$http.post(url, body, options);
      });
  }
}
