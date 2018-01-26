import { BooksService } from './../../books.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-reader-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReaderNavbarComponent implements OnInit {
  @Input() book: BehaviorSubject<Book>;

  constructor(
    private $b: BooksService
  ) {}

  hasNext(): boolean {
    return this.book.getValue().PageNumber < this.book.getValue().TotalPages - 1;
  }

  hasPrev(): boolean {
    return this.book.getValue().PageNumber > 0;
  }

  nextPage() {
    if (this.hasNext()) {
      this.$b.updateBook(Object.assign(this.book.getValue(), {PageNumber: this.book.getValue().PageNumber + 1}));
    }
  }

  previousPage() {
    if (this.hasPrev()) {
      this.$b.updateBook(Object.assign(this.book.getValue(), {PageNumber: this.book.getValue().PageNumber - 1}));
    }
  }


  ngOnInit() {
    // this.book.subscribe(b => console.log(b))
  }
}
