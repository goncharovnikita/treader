import { MainService } from './main.service';
import { AuthService } from './../auth/auth.service';
import { BooksService } from './../books.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { User } from '@firebase/auth-types';
import { trigger, state, style, transition, animate } from '@angular/core';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.sass'],
  animations: [
    trigger('state', [
      state('hidden', style({
        transform: 'translateX(-105%)'
      })),
      state('visible', style({
        transform: 'none'
      })),
      transition('* => *', animate('200ms ease-out'))
    ])
  ]
})
export class AppMainComponent implements OnInit {
  menuExpanded: BehaviorSubject<boolean>;
  selectedBook: Observable<Book>;
  user: Observable<User>;
  state = 'hidden';

  constructor(
    private $s: MainService,
    private $b: BooksService,
    private $auth: AuthService
  ) {}

  ngOnInit() {
    this.user = this.$auth.fetchAuthState();
    this.menuExpanded = this.$s.menuExpanded;
    this.selectedBook = this.$b.fetchSelectedBook();
    this.menuExpanded.subscribe(v => {
      this.state = v ? 'visible' : 'hidden';
    })
  }

  triggerMenu() {
    this.menuExpanded.next(!this.menuExpanded.getValue());
  }
}
