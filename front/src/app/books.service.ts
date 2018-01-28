import { AuthService } from './auth/auth.service';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class BooksService {
  private readonly BOOKS_STORAGE = 'books_storage';
  private readonly SELECTED_BOOK = 'selected_book';
  private readonly NEW_BOOK_URL = '/new/book';
  private readonly GET_BOOKS_URL = '/get/books';
  private readonly UPDATE_BOOK_INFO_URL = '/update/book/info';
  private books = new BehaviorSubject<{[key: string]: Book}>(null);
  private selectedBook = new BehaviorSubject<Book>(JSON.parse(localStorage.getItem(this.SELECTED_BOOK)));

  constructor(
    private $h: HttpClient,
    private $auth: AuthService,
    @Inject('BASE_URL') private $url: string
  ) {
    this._fetchBooksFromServer();
  }

  addNewBook(body: {}) {
    return this.$auth.fetchAuthState()
      .switchMap(user => {
        const options = {headers: {'user-id': user.uid}};
        return this.$h.post(this.$url + this.NEW_BOOK_URL, body, options)
          .catch(() => Observable.of(null));
      });
  }

  updateBook(b: Book) {
    const books = JSON.parse(localStorage.getItem(this.BOOKS_STORAGE));
    const book = books[b.Description.DocumentInfo.ID];
    if (!book) { return; }
    if (b.BookInfo.LastTotalPages !== book.LastTotalPages && book.LastTotalPages) {
      this.updateCurrentPage(b, book.LastTotalPages);
    }
    books[b.Description.DocumentInfo.ID] = b;
    this.books.next(books);
    localStorage.setItem(this.BOOKS_STORAGE, JSON.stringify(books));
    localStorage.setItem(this.SELECTED_BOOK, JSON.stringify(b));
    this.triggerSelectedBookToUpdate();
  }

  softUpdateBook(b: Book) {
    const books = JSON.parse(localStorage.getItem(this.BOOKS_STORAGE));
    const book = books[b.Description.DocumentInfo.ID];
    if (!book) { return; }
    if (b.BookInfo.LastTotalPages !== book.LastTotalPages && book.LastTotalPages) {
      this.updateCurrentPage(b, book.LastTotalPages);
    }
    books[b.Description.DocumentInfo.ID] = b;
    this.books.next(books);
    localStorage.setItem(this.BOOKS_STORAGE, JSON.stringify(books));
    localStorage.setItem(this.SELECTED_BOOK, JSON.stringify(b));
  }

  updateCurrentPage(b: Book, totalPages: number): void {
    const newTotal = b.BookInfo.LastTotalPages;
    const diff = totalPages / newTotal;
    b.BookInfo.LastPage = Math.floor(b.BookInfo.LastPage / diff);
  }

  fetchBooks() {
    return this.books;
  }

  pureFetchBooks() {
    return this.$auth.get(this.$url + this.GET_BOOKS_URL)
      .catch(e => Observable.of(null)).map(v => {
        if (v) {
          const result = {};
          for (let i = 0; i < Object.keys(v).length; i++) {
            const a = v[Object.keys(v)[i]];
            a['Book']['BookInfo'] = a['BookInfo'];
            result[Object.keys(v)[i]] = a['Book'];
          }
          return result;
        }
      });
  }

  pureUpdateBookInfo(i: BookInfo) {
    return this.$auth.post(this.$url + this.UPDATE_BOOK_INFO_URL, i);
  }

  fetchSelectedBook() {
    return this.selectedBook;
  }

  selectBook(b: Book) {
    this.selectedBook.next(b);
    localStorage.setItem(this.SELECTED_BOOK, JSON.stringify(b));
  }

  deleteBook(b: Book) {
    const books = JSON.parse(localStorage.getItem(this.BOOKS_STORAGE));
    const book = books[b.Description.DocumentInfo.ID];
    if (!book) { return; }
    delete books[b.Description.DocumentInfo.ID];
    this.books.next(books);
    if (this.selectedBook.getValue()) {
      if (this.selectedBook.getValue().Description.DocumentInfo.ID === b.Description.DocumentInfo.ID) {
        this.selectedBook.next(null);
        localStorage.removeItem(this.SELECTED_BOOK);
      }
    }
    localStorage.setItem(this.BOOKS_STORAGE, JSON.stringify(books));
  }

  addBook(b: Book) {
    b.BookInfo.LastPage = 0;
    b.BookInfo.LastTotalPages = 0;
    const oldBooks = this.books.getValue() ? this.books.getValue() : {};
    const newBooks = Object.assign(oldBooks, {[b.Description.DocumentInfo.ID]: b});
    localStorage.setItem(this.BOOKS_STORAGE, JSON.stringify(newBooks));
    this.books.next(newBooks);
  }

  fetchBooksFromServer() {
    this._fetchBooksFromServer();
  }

  private triggerSelectedBookToUpdate() {
    this.selectBook(this.books.getValue()[this.selectedBook.getValue().Description.DocumentInfo.ID]);
  }

  private _fetchBooksFromServer() {
    this.$auth.get(this.$url + this.GET_BOOKS_URL).catch(e => Observable.of(null)).map(v => {
      if (v) {
        const result = {};
        for (let i = 0; i < Object.keys(v).length; i++) {
          const a = v[Object.keys(v)[i]];
          console.log(a)
          a['Book']['BookInfo'] = a['BookInfo'];
          result[Object.keys(v)[i]] = a['Book'];
        }
        return result;
      }
    }).subscribe(r => {
      if (!r) {
        return;
      }
      this.books.next(r);
    });
  }

  // editBook(b: Book) {
  //   const i = this.books.getValue().indexOf(b);
  //   if (i === -1) {
  //     return;
  //   }
  //   //
  // }
}
