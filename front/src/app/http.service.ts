import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class HttpService {
  constructor(private $h: HttpClient) {}

  get(url: string, options: any): Observable<any> {
    return this.$h.get(url, options);
  }

  post(url: string, body: any, options?: any) {
    return this.$h.post(url, body, options);
  }
}
