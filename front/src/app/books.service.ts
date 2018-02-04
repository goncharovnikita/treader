import {AuthService} from './auth/auth.service';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Injectable, Inject} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

@Injectable()
export class BooksService {
  private readonly BOOKS_STORAGE = 'books_storage';
  private readonly SELECTED_BOOK = 'selected_book';
  private readonly NEW_BOOK_URL = '/book/new';
  private readonly GET_BOOKS_URL = '/get/books';
  private readonly UPDATE_BOOK_INFO_URL = '/update/book/info';
  private _initBooksFetched = new BehaviorSubject(false);
  private books = new BehaviorSubject<{ [key: string]: Book }>(null);
  private selectedBook = new BehaviorSubject<Book>(JSON.parse(localStorage.getItem(this.SELECTED_BOOK)));

  constructor(private $auth: AuthService,
              @Inject('BASE_URL') private $url: string) {
    this.fetchBooksFromServer();
  }

  addNewBook(body: {}): Observable<{ loaded: boolean, loadPercent: number, result: Book }> {
    return this.$auth.fetchAuthState()
      .switchMap(user => {
        const blob = new Blob([body]);
        const result = new Subject<LoadBookEvent>();
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `${this.$url}${this.NEW_BOOK_URL}`);
        xhr.setRequestHeader('user-id', user.uid);
        Observable.fromEvent(xhr, 'progress').subscribe((e: ProgressEvent) => {
          result.next({loaded: false, loadPercent: (e.loaded / blob.size) * 100, result: null});
        });
        Observable.fromEvent(xhr, 'load')
          .take(1).subscribe((v: ProgressEvent) => {
          result.next({loaded: true, loadPercent: 100, result: JSON.parse(v.currentTarget['response'])});
        });
        xhr.send(body);
        return result;
      });
  }

  updateBook(b: Book) {
    const books = JSON.parse(localStorage.getItem(this.BOOKS_STORAGE));
    const book = books[b.Description.DocumentInfo.ID];
    if (!book) {
      return;
    }
    if (b.BookInfo.LastTotalPages !== book.LastTotalPages && book.LastTotalPages) {
      // this.updateCurrentPage(b.BookInfo, book.LastTotalPages);
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
    if (!book) {
      return;
    }
    if (b.BookInfo.LastTotalPages !== book.LastTotalPages && book.LastTotalPages) {
      // this.updateCurrentPage(b.BookInfo, book.LastTotalPages);
    }
    books[b.Description.DocumentInfo.ID] = b;
    this.books.next(books);
    localStorage.setItem(this.BOOKS_STORAGE, JSON.stringify(books));
    localStorage.setItem(this.SELECTED_BOOK, JSON.stringify(b));
  }

  fetchBooks() {
    return this._initBooksFetched.filter(v => v === true).switchMap(v => {
      return this.books;
    });
  }

  pureUpdateBookInfo(i: BookInfo) {
    return this.$auth.post(this.UPDATE_BOOK_INFO_URL, i);
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
    if (!book) {
      return;
    }
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
    this._fetchBooksFromServer().subscribe(() => {
      this._initBooksFetched.next(true);
    });
  }

  refetchBooks(): Observable<boolean> {
    return this._fetchBooksFromServer();
  }

  private triggerSelectedBookToUpdate() {
    this.selectBook(this.books.getValue()[this.selectedBook.getValue().Description.DocumentInfo.ID]);
  }

  private _fetchBooksFromServer(): Observable<boolean> {
    console.log('fetching books from server...');
    return this.$auth.get(this.GET_BOOKS_URL).catch(e => Observable.of(null)).map(v => {
      console.log(v);
      if (v) {
        const result = {};
        for (let i = 0; i < Object.keys(v).length; i++) {
          const a = v[Object.keys(v)[i]];
          a['Book']['BookInfo'] = a['BookInfo'];
          result[Object.keys(v)[i]] = a['Book'];
        }
        return result;
      }
    }).map(r => {
      console.log(r);
      if (!r) {
        return true;
      }
      this.books.next(r);
      return true;
    });
  }
}
