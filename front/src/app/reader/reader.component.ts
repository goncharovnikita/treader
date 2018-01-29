import { BooksService } from './../books.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { ReaderService } from './reader.service';
import {
  Component,
  OnInit,
  Input,
  ViewChild,
  ElementRef,
  NgZone,
  AfterViewInit,
  ChangeDetectorRef,
  ChangeDetectionStrategy,
  OnDestroy
} from '@angular/core';
import { uniqueChars } from './unique-chars';
import { Subject } from 'rxjs/Subject';
import { AppService } from '../app.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reader',
  templateUrl: './reader.component.html',
  styleUrls: ['./reader.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReaderComponent implements OnInit, AfterViewInit, OnDestroy {
  book: Subject<Book> = new Subject();
  @ViewChild('contentEl') contentRef: ElementRef;
  @ViewChild('cWidthMeasureEl') cWidthMeasureEl: ElementRef;
  sections: {P: Array<string>}[];
  currentPage = new BehaviorSubject(0);
  totalPages = new BehaviorSubject(0);
  uniqueChars = uniqueChars;
  currentPageValue = new BehaviorSubject([]);
  ready = new Subject();
  pages = new BehaviorSubject([[]]);
  pHeight = 18;
  numbersOfParagraphsPerPage: number;
  subscribed = false;
  bookInfo: BookInfo;
  /**
   * Constructor
   */
  constructor(
    private $s: ReaderService,
    private $zone: NgZone,
    private $cdr: ChangeDetectorRef,
    private $b: BooksService,
    private $app: AppService,
    private $route: ActivatedRoute
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
    this.book = this.$b.fetchSelectedBook();
    this.book.subscribe(b => {
      console.log(b);
      if (!b) { return; }
      this.bookInfo = b.BookInfo;
      this.bookInfo.LastOpenedDate = new Date().toDateString();
      this.bookInfo.TotalOpenings++;
      this.sections = b.Body.Sections;
      this.currentPage.next(b.BookInfo.LastPage);
      if (this.contentRef.nativeElement.clientHeight > 0) {
        this.pages.next(this.parseBookContent(this.getCharWidthMap()));
        this.currentPageValue.next(this.pages.getValue()[this.currentPage.getValue()]);
      }
      if (!this.subscribed) {
        this.subscriptions();
      }
    });
  }

  updateBookInfo() {
    this.$b.pureUpdateBookInfo(this.bookInfo).subscribe(() => {});
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

  /**
   * Subscribe on various events
   */
  subscriptions() {
    this.subscribed = true;
    console.log('subscriptions');
    this.ready.subscribe(() => {
      console.log('view ready');
      this.pages.subscribe(p => {
        console.log(p)
        if (p.length) {
          this.totalPages.next(p.length);
          this.bookInfo.LastTotalPages = p.length;
          this.updateBookInfo();
        }
        if (this.contentRef.nativeElement.clientHeight > 0) {
          // this.$b.softUpdateBook(Object.assign(this.book.getValue(), { TotalPages: p.length }));
        }
        this.currentPageValue.next(this.pages.getValue()[this.currentPage.getValue()]);
      });

      Observable.fromEvent(window, 'resize')
        .debounceTime(200).subscribe(e => {
          this.pages.next(this.parseBookContent(this.getCharWidthMap()));
        });

      this.currentPage.subscribe(p => {
        console.log(p);
        this.updateBookInfo();
        this.bookInfo.LastPage = p;
        // this.$b.softUpdateBook(Object.assign(this.book.getValue(), {PageNumber: p}));
        this.currentPageValue.next(this.pages.getValue()[p]);
      });

      this.$s.triggerRefetchBookData.subscribe(v => {
        console.log('refetch book data');
        Observable.timer(50).subscribe(_ => {
          this.pages.next(this.parseBookContent(this.getCharWidthMap()));
        });
      });
    });
  }

  nextPage() {
    this.currentPage.next(this.currentPage.getValue() + 1);
  }

  prevPage() {
    this.currentPage.next(this.currentPage.getValue() - 1);
  }

  splitWords(t: string) {
    return t.split('');
  }

  parseBookContent(charWidthMap: {}) {
    console.log('Parse book content');
    let restHeight = this.contentRef.nativeElement.clientHeight - 100;
    if (restHeight < 1) { return [[]]; }
    const result = [];
    let currPage = [];
    let width = this.contentRef.nativeElement.clientWidth - 21;
    if (width > 579) {
      console.log((((this.contentRef.nativeElement.clientWidth / 100) * 40) + 9))
      width -= (((this.contentRef.nativeElement.clientWidth / 100) * 40) + 9);
    }
    let pHeight = 18;
    if (this.cWidthMeasureEl.nativeElement.children[0]) {
      pHeight = this.cWidthMeasureEl.nativeElement.children[0].offsetHeight;
    }
    const remainingArray = this.getFlatContent(this.sections);
    for (let i = 0; i < remainingArray.length; i++) {
    // for (let i = 0; i < 30; i++) {
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
          prevIndex = j - 1;
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

  /**
   * OnDestroy
   */
  ngOnDestroy() {
    this.updateBookInfo();
  }
}
