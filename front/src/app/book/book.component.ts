import { Router } from '@angular/router';
import { BooksService } from './../books.service';
import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-book-unit',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BookUnitComponent implements OnInit {
  @Input() book: Book;
  constructor(
    private $b: BooksService,
    private $sanitizer: DomSanitizer,
    private $router: Router
  ) {}

  get author(): string {
    const a = this.book.Description.DocumentInfo.Author[0];
    return `${a.FirstName} ${a.LastName}`;
  }

  get cover(): SafeUrl {
    const id = this.book.Description.TitleInfo.Coverpage.Image.Href;
    if (!id) { return ''; }
    const bin = this.book.Binary;
    const r = {Binary: '', ContentType: ''};
  _loop:
    for (let i = 0; i < bin.length; i++) {
      if (`#${bin[i].ID}` === id) {
        r.Binary = bin[i].Value;
        r.ContentType = bin[i].ContentType;
        break _loop;
      }
    }

    if (!r.Binary) { return ''; }
    const b64 = `data:${r.ContentType}; base64,${r.Binary}`;
    return this.$sanitizer.bypassSecurityTrustUrl(b64);
  }

  deleteBook() {
    this.$b.deleteBook(this.book);
  }

  selectBook() {
    this.$router.navigate([`/book/${this.book.Description.DocumentInfo.ID}`]);
  }

  ngOnInit() {}
}
