import {AuthService} from './../auth/auth.service';
import {BooksService} from './../books.service';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';

@Injectable()
export class AddBookService {
  private readonly ADD_BOOK_TO_USER_URL = '/user/add/book';

  constructor(private $b: BooksService,
              private $h: AuthService) {
  }

  addBook(b: Book): Observable<LoadBookEvent> {
    return this.$b.addNewBook(b);
  }

  triggerBooksToRefetch(): Observable<any> {
    return this.$b.refetchBooks();
  }

  addBookToUser(id: string): Observable<boolean> {
    return this.$h.purePost<any>(this.ADD_BOOK_TO_USER_URL, {}, {params: {'book_id': id}}).map(r => {
      switch (r.status) {
        case 204:
          return true;
        default:
          return false;
      }
    });
  }
}
