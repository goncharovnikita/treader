import { AuthService } from './../auth/auth.service';
import { Router } from '@angular/router';
import { MainService } from './../main/main.service';
import { BooksService } from './../books.service';
import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef, Input } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.sass']
})
export class MenuComponent implements OnInit {
  @Input() expanded: Observable<boolean>;
  addNewViewed = false;
  bookLoaded = false;
  constructor(
    private $s: MainService,
    private $b: BooksService,
    private $cdr: ChangeDetectorRef,
    private $router: Router,
    private $auth: AuthService
  ) { }

  ngOnInit() {
 
  }

  addBook() {
    this.addNewViewed = true;
  }

  killSelf() {
    this.$s.menuExpanded.next(false);
  }

  killAddBook(v: boolean) {
    this.addNewViewed = false;
    if (this.bookLoaded) {
      this.killSelf();
    }
  }

  loadBook(e: boolean) {
    this.bookLoaded = e;
  }

  logout() {
    this.$auth.logout();
  }

  toLib() {
    this.$router.navigate(['/library']);
  }

}
