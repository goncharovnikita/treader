import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class AppService {
  private readonly BOOKS_STORAGE = 'books_storage';
  private readonly SELECTED_BOOK = 'selected_book';
  private books = new BehaviorSubject(JSON.parse(localStorage.getItem(this.BOOKS_STORAGE)));
  private selectedBook = new BehaviorSubject(JSON.parse(localStorage.getItem(this.SELECTED_BOOK)));
  menuExpanded = new BehaviorSubject(false);

  private readonly NEW_BOOK_URL = '/new/book/';
  constructor(
    private $h: HttpClient,
    @Inject('BASE_URL') private $url: string
  ) {}

  addNewBook(body: {}) {
    return this.$h.post(this.$url + this.NEW_BOOK_URL, body)
      .catch(() => Observable.of(null));
  }

  fetchBooks() {
    return this.books;
  }

  selectBook(b: Book) {
    this.selectedBook.next(b);
    localStorage.setItem(this.SELECTED_BOOK, JSON.stringify(b));
  }

  fetchSelectedBook() {
    return this.selectedBook;
  }

  setBooks(b: Book) {
    const oldBooks = this.books.getValue() ? this.books.getValue() : [];
    const newBooks = [...oldBooks, b];
    localStorage.setItem(this.BOOKS_STORAGE, JSON.stringify(newBooks));
    this.books.next(newBooks);
  }

  editBook(b: Book) {
    const i = this.books.getValue().indexOf(b);
    if (i === -1) {
      return;
    }
    //
  }
}
