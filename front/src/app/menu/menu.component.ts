import { AppService } from './../app.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.sass']
})
export class MenuComponent implements OnInit {
  books: Observable<Array<Book>>;
  constructor(private $s: AppService) { }

  ngOnInit() {
    this.books = this.$s.books;
  }

}
