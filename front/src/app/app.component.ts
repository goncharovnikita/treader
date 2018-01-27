import { BooksService } from './books.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { AppService } from './app.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { User } from 'firebase/app';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  user: Observable<User>;
  constructor(
    private $auth: AuthService
  ) {}

  ngOnInit() {
    this.user = this.$auth.fetchAuthState();
    this.user.subscribe(u => console.log(u));
  }
}
