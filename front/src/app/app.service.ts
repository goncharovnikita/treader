import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class AppService {
  private readonly BOOKS_STORAGE = 'bks_stor';
  menuExpanded = new BehaviorSubject(false);
  books = new BehaviorSubject(JSON.parse(localStorage.getItem(this.BOOKS_STORAGE)));
}
