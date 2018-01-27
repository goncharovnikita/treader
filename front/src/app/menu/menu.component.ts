import { MainService } from './../main/main.service';
import { BooksService } from './../books.service';
import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.sass']
})
export class MenuComponent implements OnInit {
  books: Observable<Array<Book>>;
  @ViewChild('fileInput') fileInputRef: ElementRef;
  constructor(
    private $s: MainService,
    private $b: BooksService,
    private $cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.$cdr.detach();
    this.books = this.$b.fetchBooks().map(b => b ? <Array<Book>>Object.values(b) : []);
    this.books.debounceTime(200).subscribe(() => {
      this.$cdr.detectChanges();
    });
  }

  onFileChange() {
    this.$b.addNewBook(this.fileInputRef.nativeElement.files[0])
      .subscribe((r: {book: Book}) => {
        console.log(r);
        if (r.book) {
          this.$b.addBook(r.book);
          this.fileInputRef.nativeElement.value = '';
          this.$cdr.detectChanges();
        }
      });
  }

  selectBook(b: Book) {
    this.$b.selectBook(b);
  }

}
