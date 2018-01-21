import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '../translate/service';

@Injectable()
export class ReaderService {
  constructor(
    private $t: TranslateService
    // @Inject('BASE_URL') private url: string
  ) {}

  translate(w: string) {
    return this.$t.translate(w);
  }
}
