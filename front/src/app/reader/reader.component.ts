import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { ReaderService } from './reader.service';
import { Component, OnInit, Input, ViewChild, ElementRef, NgZone } from '@angular/core';

@Component({
  selector: 'app-reader',
  templateUrl: './reader.component.html',
  styleUrls: ['./reader.component.sass']
})
export class ReaderComponent implements OnInit {
  @Input() book: BehaviorSubject<Book>;
  @ViewChild('contentEl') contentRef: ElementRef;
  currentPageValue = new BehaviorSubject([]);
  currentPage = new BehaviorSubject(0);
  pages = new BehaviorSubject([[]]);
  totalPagesCount = 0;
  pHeight = 18;
  numbersOfParagraphsPerPage: number;
  /**
   * Constructor
   */
  constructor(
    private $s: ReaderService,
    private $zone: NgZone
  ) {}

  get bookTitle(): string {
    return this.book.getValue().Description.TitleInfo.BookTitle;
  }

  get author(): string {
    const aPath = this.book.getValue().Description.DocumentInfo.Author[0];
    const firstName  = aPath.FirstName ? aPath.FirstName : '';
    const middleName = aPath.MiddleName ? aPath.MiddleName : '';
    const lastName   = aPath.LastName ? aPath.LastName : '';
    if (!aPath) { return ''; }
    return `${firstName} ${middleName} ${lastName}`;
  }

  ngOnInit() {
    this.book.subscribe(b => {
      console.log(b);
      if (!b) { return; }
      // this.pages.next(this.caclulatePageContent());
      this.pages.next(this.parseBookContent());
      if (this.book.getValue().LastPageNumber) {
        this.currentPage.next(this.book.getValue().LastPageNumber);
      }
    });
    this.subscriptions();
  }

  translate(w: string) {
    return this.$s.translate(w);
  }

  /**
   * Subscribe on various events
   */
  subscriptions() {
    this.currentPage.subscribe(v => {
      this.$s.updateBook(Object.assign(this.book.getValue(), {LastPageNumber: v}));
      this.currentPageValue.next(this.pages.getValue()[v]);
    });

    this.pages.subscribe(p => {
      console.log(p);
      this.totalPagesCount = p.length;
      this.currentPageValue.next(this.pages.getValue()[this.currentPage.getValue()]);
    });

    Observable.fromEvent(window, 'resize')
      .debounceTime(200).subscribe(e => {
        // this.pages.next(this.caclulatePageContent());
        this.pages.next(this.parseBookContent());
      });

    this.$s.triggerRefetchBookData.subscribe(v => {
      // console.log(v);
      // Observable.timer(50).subscribe(_ => this.pages.next(this.caclulatePageContent()));
      Observable.timer(50).subscribe(_ => this.pages.next(this.parseBookContent()));
    });

    this.addWindowListener();
  }

  splitWords(t: string) {
    return t.split('');
  }

  wordClicked(w: string) {
    console.log(w);
  }

  addWindowListener() {
    Observable.fromEvent(this.contentRef.nativeElement, 'click').subscribe($e => {
      const w = this.getClickedWord();
      if (!w) { return; }
      this.translate(w).subscribe(r => {
        this.replaceSelectedText(r);
      });
    });
  }

  hasNext(): boolean {
    return this.currentPage.getValue() < this.totalPagesCount - 1;
  }

  hasPrev(): boolean {
    return this.currentPage.getValue() > 0;
  }

  getClickedRange(): any {
    const s = window.getSelection();
    const range = s.getRangeAt(0);
    const node = s.anchorNode;
    let e1 = false;
    let e2 = false;
  rangesetter:
    while (range.toString().indexOf(' ') !== 0) {
      try {
        range.setStart(node, (range.startOffset - 1));
      } catch (e) {
        e1 = true;
        break rangesetter;
      }
    }
    if (!e1) { range.setStart(node, range.startOffset + 1); }
  rangesetter:
    while (range.toString().indexOf(' ') === -1 && range.toString().trim() !== '') {
      try {
        range.setEnd(node, range.endOffset + 1);
      } catch (e) {
        e2 = true;
        break rangesetter;
      }
    }
    if (!e2) {
      range.setEnd(node, range.endOffset - 1);
    } else {
    }
    return range;
  }

  getClickedWord(): string {
    const str = this.getClickedRange().toString().trim();
    return str;
  }

  replaceSelectedText(replacementText) {
    const range = this.getClickedRange();
    range.deleteContents();
    range.insertNode(document.createTextNode(`${replacementText}`));
    window.getSelection().removeRange(range);
  }

  nextPage() {
    if (this.hasNext()) {
      this.currentPage.next(this.currentPage.getValue() + 1);
    }
  }

  previousPage() {
    if (this.hasPrev()) {
      this.currentPage.next(this.currentPage.getValue() - 1);
    }
  }

  parseBookContent() {
    let restHeight = this.contentRef.nativeElement.clientHeight;
    if (restHeight < 1) { return [[]]; }
    const result = [];
    let currPage = [];
    const charWidth = 10;
    const width = this.contentRef.nativeElement.clientWidth;
    const pHeight = 18;
    const jumpingLimit = 10000;
    const remainingArray = this.getFlatContent(this.book.getValue().Body.Sections);
    for (let i = 0; i < remainingArray.length; i++) {
      let a = width;
      let prevSlice = 0;
      for (let j = 0; j < remainingArray[i].length; j++) {
        if (a <= 0) {
          currPage.push(remainingArray[i].slice(prevSlice, j));
          prevSlice = j;
          a = width;
          restHeight -= pHeight;
          if (restHeight - pHeight < 0) {
            result.push(currPage);
            currPage = [];
            restHeight = this.contentRef.nativeElement.clientHeight;
          }
        } else {
          a -= charWidth;
        }
      }
      currPage.push(remainingArray[i].slice(prevSlice));
      restHeight -= pHeight;
      if (restHeight - pHeight < 0) {
        result.push(currPage);
        currPage = [];
        restHeight = this.contentRef.nativeElement.clientHeight;
      }
    }
    if (currPage.length > 0) {
      result.push(currPage);
    }
    console.log(result);
    return result;
  }

  getFlatContent(v: {P: Array<string>}[]): Array<string> {
    const result = [];
    for (const i of v) {
      result.push(...i.P);
    }
    return result;
  }
}
