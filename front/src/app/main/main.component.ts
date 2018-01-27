import { MainService } from './main.service';
import { AuthService } from './../auth/auth.service';
import { BooksService } from './../books.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass']
})
export class AppMainComponent implements OnInit {
  menuExpanded: BehaviorSubject<boolean>;
  selectedBook: Observable<Book>;

  constructor(
    private $s: MainService,
    private $b: BooksService,
    private $auth: AuthService
  ) {}

  ngOnInit() {
    this.menuExpanded = this.$s.menuExpanded;
    this.selectedBook = this.$b.fetchSelectedBook();
  }

  triggerMenu() {
    this.menuExpanded.next(!this.menuExpanded.getValue());
  }
}
