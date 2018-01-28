import { BooksService } from './../books.service';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.sass']
})
export class LibraryComponent implements OnInit {
  books: Observable<Array<Book>>;
  constructor(private $b: BooksService) {}

  ngOnInit() {
    this.books = this.$b.fetchBooks().map(b => b ? Object.values(b) : []);
    this.books.subscribe(console.log)
  }
}
