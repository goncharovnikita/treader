import { BooksService } from './../../books.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-reader-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReaderNavbarComponent implements OnInit {
  @Input() totalPages: BehaviorSubject<number>;
  @Input() currentPage: BehaviorSubject<number>;
  @Input() nextPageHook: () => void;
  @Input() prevPageHook: () => void;

  constructor(
    private $b: BooksService,
    private $cdr: ChangeDetectorRef
  ) {}

  hasNext(): Observable<boolean> {
    return this.currentPage.switchMap(c => {
      return this.totalPages.map(t => c < t - 1);
    });
    // return this.book.getValue().PageNumber < this.book.getValue().TotalPages - 1;
  }

  hasPrev(): Observable<boolean> {
    return this.currentPage.map(c => c > 0);
  }

  nextPage() {
    if (this.hasNext()) {
      this.nextPageHook();
    }
  }

  previousPage() {
    if (this.hasPrev()) {
      this.prevPageHook();
    }
  }


  ngOnInit() {
    // this.$cdr.detach();
  }
}
