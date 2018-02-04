import { AuthService } from './../auth/auth.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class ProfileService {
  private readonly GET_USER_STATISTICS_URL = '/user/get/statistics';
  constructor(
    private $auth: AuthService
  ) {}

  fetchUserStatistics(): Observable<UserStatistics> {
    return this.$auth.get(this.GET_USER_STATISTICS_URL).catch(e => Observable.of(null));
  }
}
