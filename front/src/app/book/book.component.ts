import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-book-unit',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.sass']
})
export class BookUnitComponent implements OnInit {
  @Input() book: Book;


  ngOnInit() {}
}
