import { BooksService } from './../books.service';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable()
export class SelectedBookResolver implements Resolve<Book> {

  constructor(private $s: BooksService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Book> {
    return this.$s.pureFetchBooks()
      .map(b => {
        const book: Book = b[route.params['book_id']];
        console.log(book);
        if (!book) {
          return null;
        }
        this.$s.selectBook(book);
        return book;
      }).take(1);
  }
}
