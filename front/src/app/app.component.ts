import { BooksService } from './books.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { AppService } from './app.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  selectedBook: Observable<Book>;
  menuExpanded: BehaviorSubject<boolean>;
  constructor(
    private $s: AppService,
    private $b: BooksService
  ) {}

  ngOnInit() {
    this.menuExpanded = this.$s.menuExpanded;
    this.selectedBook = this.$b.fetchSelectedBook();
  }

  triggerMenu() {
    this.menuExpanded.next(!this.menuExpanded.getValue());
  }
}
