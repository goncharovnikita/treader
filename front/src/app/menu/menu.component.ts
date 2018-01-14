import { AppService } from './../app.service';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.sass']
})
export class MenuComponent implements OnInit {
  books: Observable<Array<Book>>;
  @ViewChild('fileInput') fileInputRef: ElementRef;
  constructor(private $s: AppService) { }

  ngOnInit() {
    this.books = this.$s.books;
  }

  onFileChange() {
    this.$s.addNewBook(this.fileInputRef.nativeElement.files[0])
      .subscribe(console.log);
  }

}
