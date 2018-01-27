import { BooksService } from './../books.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AppService } from './../app.service';
import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TranslateService } from '../translate/service';

@Injectable()
export class ReaderService {
  triggerRefetchBookData = new BehaviorSubject(false);
  constructor(
    private $t: TranslateService,
    private $app: AppService,
    private $b: BooksService
    // @Inject('BASE_URL') private url: string
  ) {
    this.$app.menuExpanded.subscribe(this.triggerRefetchBookData);
  }

  translate(w: string) {
    return this.$t.translate(w);
  }

  updateBook(b: Book) {
    this.$b.updateBook(b);
  }

}
