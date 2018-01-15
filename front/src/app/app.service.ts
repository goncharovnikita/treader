import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class AppService {
  private readonly BOOKS_STORAGE = 'bks_stor';
  menuExpanded = new BehaviorSubject(false);
  books = new BehaviorSubject(JSON.parse(localStorage.getItem(this.BOOKS_STORAGE)));

  private readonly NEW_BOOK_URL = 'http://127.0.0.1:8080/new/book/';
  constructor(private $h: HttpClient) {}

  addNewBook(body: {}) {
    return this.$h.post(this.NEW_BOOK_URL, body);
  }
}
