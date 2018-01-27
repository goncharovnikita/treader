import { Router } from '@angular/router';
import { BooksService } from './../books.service';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {
  books: Observable<Array<Book>>;
  constructor(
    private $bs: BooksService,
    private $router: Router
  ) {}

  ngOnInit() {
    this.books = this.$bs.fetchBooks().map(b => b ? Object.values(b) : []);
  }

  selectBook(b:  Book) {
    this.$router.navigate([`/book/${b.Description.DocumentInfo.ID}`]);
  }
}
