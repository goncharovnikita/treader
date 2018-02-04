import { BooksService } from './../books.service';
import { Router } from '@angular/router';
import { AuthService } from './../auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { User } from '@firebase/auth-types';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.sass']
})
export class NavComponent implements OnInit {
  private _book: Book;
  user: Observable<User>;
  selectedBook: Observable<Book>;
  constructor(
    private $auth: AuthService,
    private $router: Router,
    private $b: BooksService
  ) {}

  ngOnInit() {
    this.user = this.$auth.fetchAuthState();
    this.selectedBook = this.$b.fetchSelectedBook();
    this.selectedBook.subscribe(b => this._book = b);
  }

  toLibrary() {
    this.$router.navigate(['/library']);
  }

  toHome() {
    this.$router.navigate(['/home']);
  }

  toSettings() {
    this.$router.navigate(['/settings']);
  }

  toProfile() {
    this.$router.navigate(['/profile']);
  }

  toSelected() {
    this.$router.navigate([`/book/${this._book.ID}`]);
  }
}
