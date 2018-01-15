import { Observable } from 'rxjs/Observable';
import { AppService } from './app.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  selectedBook: Observable<Book>;
  constructor(
    private $s: AppService
  ) {}

  ngOnInit() {
    this.selectedBook = this.$s.fetchSelectedBook();
  }
}
