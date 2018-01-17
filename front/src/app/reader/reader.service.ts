import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ReaderService {
  constructor(
    private $h: HttpClient
    // @Inject('BASE_URL') private url: string
  ) {}

  translate(w: string) {
    return this.$h.get('http://127.0.0.1:8080/translate/?query=' + w);
  }
}
