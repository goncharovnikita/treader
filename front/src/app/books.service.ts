import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class BooksService {
  private readonly BOOKS_STORAGE = 'books_storage';
  private readonly SELECTED_BOOK = 'selected_book';
  private readonly NEW_BOOK_URL = '/new/book/';
  private books = new BehaviorSubject<{[key: string]: Book}>(JSON.parse(localStorage.getItem(this.BOOKS_STORAGE)));
  private selectedBook = new BehaviorSubject<Book>(JSON.parse(localStorage.getItem(this.SELECTED_BOOK)));

  constructor(
    private $h: HttpClient,
    @Inject('BASE_URL') private $url: string
  ) {}

  addNewBook(body: {}) {
    return this.$h.post(this.$url + this.NEW_BOOK_URL, body)
      .catch(() => Observable.of(null));
  }

  updateBook(b: Book) {
    const books = JSON.parse(localStorage.getItem(this.BOOKS_STORAGE));
    const book = books[b.Description.DocumentInfo.ID];
    if (!book) { return; }
    if (b.TotalPages !== book.TotalPages && book.TotalPages) {
      this.updateCurrentPage(b, book.TotalPages);
    }
    books[b.Description.DocumentInfo.ID] = b;
    this.books.next(books);
    localStorage.setItem(this.BOOKS_STORAGE, JSON.stringify(books));
    localStorage.setItem(this.SELECTED_BOOK, JSON.stringify(b));
    this.triggerSelectedBookToUpdate();
  }

  updateCurrentPage(b: Book, totalPages: number): void {
    const newTotal = b.TotalPages;
    const diff = totalPages / newTotal;
    b.PageNumber = Math.floor(b.PageNumber / diff);
  }

  fetchBooks() {
    return this.books;
  }

  private triggerSelectedBookToUpdate() {
    this.selectBook(this.books.getValue()[this.selectedBook.getValue().Description.DocumentInfo.ID]);
  }

  selectBook(b: Book) {
    this.selectedBook.next(b);
    localStorage.setItem(this.SELECTED_BOOK, JSON.stringify(b));
  }

  fetchSelectedBook() {
    return this.selectedBook;
  }

  addBook(b: Book) {
    b.PageNumber = 0;
    b.TotalPages = 0;
    const oldBooks = this.books.getValue() ? this.books.getValue() : {};
    const newBooks = Object.assign(oldBooks, {[b.Description.DocumentInfo.ID]: b});
    localStorage.setItem(this.BOOKS_STORAGE, JSON.stringify(newBooks));
    this.books.next(newBooks);
  }

  // editBook(b: Book) {
  //   const i = this.books.getValue().indexOf(b);
  //   if (i === -1) {
  //     return;
  //   }
  //   //
  // }
}
