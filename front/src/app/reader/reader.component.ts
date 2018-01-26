import { BooksService } from './../books.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { ReaderService } from './reader.service';
import { Component, OnInit, Input, ViewChild, ElementRef, NgZone, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { uniqueChars } from './unique-chars';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'app-reader',
  templateUrl: './reader.component.html',
  styleUrls: ['./reader.component.sass']
})
export class ReaderComponent implements OnInit, AfterViewInit {
  @Input() book: BehaviorSubject<Book>;
  @ViewChild('contentEl') contentRef: ElementRef;
  @ViewChild('cWidthMeasureEl') cWidthMeasureEl: ElementRef;
  uniqueChars = uniqueChars;
  currentPageValue = new BehaviorSubject([]);
  ready = new Subject();
  pages = new BehaviorSubject([[]]);
  pHeight = 18;
  numbersOfParagraphsPerPage: number;
  subscribed = false;
  /**
   * Constructor
   */
  constructor(
    private $s: ReaderService,
    private $zone: NgZone,
    private $cdr: ChangeDetectorRef,
    private $b: BooksService
  ) {}

  get bookTitle(): Observable<string> {
    return this.book.map(b => b ? b.Description.TitleInfo.BookTitle : '');
  }

  get author(): Observable<string> {
    return this.book.map(b => {
      if (!b) { return ''; }
      const aPath = b.Description.DocumentInfo.Author[0];
      const firstName  = aPath.FirstName ? aPath.FirstName : '';
      const middleName = aPath.MiddleName ? aPath.MiddleName : '';
      const lastName   = aPath.LastName ? aPath.LastName : '';
      if (!aPath) { return ''; }
      return `${firstName} ${middleName} ${lastName}`;
    });
  }

  ngOnInit() {
    // this.$cdr.detach();
    this.book.subscribe(b => {
      if (!b) { return; }
      this.currentPageValue.next(this.pages.getValue()[b.PageNumber]);
      this.$cdr.detectChanges();
      if (!this.subscribed) {
        this.subscriptions();
      }
    });
  }

  ngAfterViewInit() {
    this.ready.next(true);
  }

  getCharWidthMap(): {} {
    const result = {};
    for (const child of this.cWidthMeasureEl.nativeElement.children) {
      result[child.innerHTML] = child.offsetWidth + 1;
    }
    return result;
  }

  translate(w: string) {
    return this.$s.translate(w);
  }

  /**
   * Subscribe on various events
   */
  subscriptions() {
    this.subscribed = true;
    console.log('subscriptions')
    this.pages.next(this.parseBookContent(this.getCharWidthMap()));
    this.ready.subscribe(() => {
      console.log('view ready');
      this.pages.subscribe(p => {
        console.log(p)
        this.$b.updateBook(Object.assign(this.book.getValue(), { TotalPages: p.length }));
        this.currentPageValue.next(this.pages.getValue()[this.book.getValue().PageNumber]);
        this.$cdr.markForCheck();
      });

      Observable.fromEvent(window, 'resize')
        .debounceTime(200).subscribe(e => {
          this.pages.next(this.parseBookContent(this.getCharWidthMap()));
        });

      this.$s.triggerRefetchBookData.subscribe(v => {
        console.log('refetch book data')
        Observable.timer(50).subscribe(_ => this.pages.next(this.parseBookContent(this.getCharWidthMap())));
      });

      // this.currentPage.subscribe(v => {
      // });
      // this.addWindowListener();
    });
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

  parseBookContent(charWidthMap: {}) {
    let restHeight = this.contentRef.nativeElement.clientHeight - 100;
    if (restHeight < 1) { return [[]]; }
    const result = [];
    let currPage = [];
    const width = this.contentRef.nativeElement.clientWidth - 9;
    let pHeight = 18;
    if (this.cWidthMeasureEl.nativeElement.children[0]) {
      pHeight = this.cWidthMeasureEl.nativeElement.children[0].offsetHeight;
    }
    const remainingArray = this.getFlatContent(this.book.getValue().Body.Sections);
    for (let i = 0; i < remainingArray.length; i++) {
    // for (let i = 0; i < 80; i++) {
      if (restHeight - pHeight <= 0) {
        result.push(currPage);
        currPage = [];
        restHeight = this.contentRef.nativeElement.clientHeight - 100;
      }
      const s = remainingArray[i];
      const w = s.split(' ');
      let wv = width;
      let prevIndex = 0;
      let cutIndex = 0;
      for (let j = 0; j < w.length; j++) {
        const cw = w[j].split('').reduce((acc, curr) => acc + (charWidthMap[curr] ? charWidthMap[curr] : 8), 0) + 8;
        if (cw === NaN) {
          console.log(w[j]);
        }
        if (wv - cw <= 4) {
          if (restHeight - pHeight <= 0) {
            result.push(currPage);
            currPage = [];
            restHeight = this.contentRef.nativeElement.clientHeight - 100;
          }
          currPage.push(w.slice(prevIndex, j - 1).join(' '));
          restHeight -= pHeight;
          prevIndex = j;
          cutIndex = j - 1;
          wv = width;
        } else {
          wv -= cw;
        }
      }
      if (restHeight - pHeight <= 0) {
        result.push(currPage);
        currPage = [];
        restHeight = this.contentRef.nativeElement.clientHeight - 100;
      }
      restHeight -= pHeight;
      currPage.push(w.slice(cutIndex).join(' '));
    }

    if (currPage.length > 0) {
      const rest = currPage;
      if (restHeight - pHeight <= 0) {
        result.push(currPage);
        currPage = [];
        restHeight = this.contentRef.nativeElement.clientHeight - 100;
      }
      result.push(rest);
    }
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
