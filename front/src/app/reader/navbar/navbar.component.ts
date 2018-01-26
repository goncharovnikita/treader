import { BooksService } from './../../books.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-reader-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass']
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReaderNavbarComponent implements OnInit {
  @Input() book: BehaviorSubject<Book>;

  constructor(
    private $b: BooksService,
    private $cdr: ChangeDetectorRef
  ) {}

  hasNext(): Observable<boolean> {
    return this.book.map(b => b.PageNumber < b.TotalPages - 1);
    // return this.book.getValue().PageNumber < this.book.getValue().TotalPages - 1;
  }

  hasPrev(): Observable<boolean> {
    return this.book.map(b => b.PageNumber > 0);
  }

  nextPage() {
    // this.$cdr.markForCheck();
    if (this.hasNext()) {
      this.$b.updateBook(Object.assign(this.book.getValue(), {PageNumber: this.book.getValue().PageNumber + 1}));
    }
  }

  previousPage() {
    this.$cdr.markForCheck();
    if (this.hasPrev()) {
      this.$b.updateBook(Object.assign(this.book.getValue(), {PageNumber: this.book.getValue().PageNumber - 1}));
    }
  }


  ngOnInit() {
    // this.$cdr.detach();
    this.book.subscribe(b => {
      console.log(b);
      // this.$cdr.detectChanges();
    });
  }
}
