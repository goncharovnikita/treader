import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { BooksHelper } from './../helpers/books.helper';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';

export class Booker {

  constructor(private $sanitizer: DomSanitizer) {}

  public book = new BehaviorSubject<Book>(null);

  public getAuthor(): string {
    const b = this.book.getValue();
    return b ? BooksHelper.GetAuthor(b) : '';
  }

  public getTitle(): string {
    const b = this.book.getValue();
    return b ? BooksHelper.GetTitle(b) : '';
  }

  public getCoverpage(): SafeUrl {
    const b = this.book.getValue();
    /** TODO: add placeholder */
    if (!b) { return ''; }
    const id = b.Description.TitleInfo.Coverpage.Image.Href;
    if (!id) { return ''; }
    const bin = b.Binary;
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
}
