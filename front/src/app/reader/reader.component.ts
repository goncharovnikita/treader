import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { ReaderService } from './reader.service';
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-reader',
  templateUrl: './reader.component.html',
  styleUrls: ['./reader.component.sass']
})
export class ReaderComponent implements OnInit {
  @Input() book: Observable<Book>;
  @ViewChild('contentEl') contentRef: ElementRef;
  currentPageValue = new BehaviorSubject([]);
  pages = new BehaviorSubject(0);
  pHeight = 18;
  numbersOfParagraphsPerPage: number;
  constructor(
    private $s: ReaderService
  ) {}

  ngOnInit() {
    this.numbersOfParagraphsPerPage = parseInt((this.contentRef.nativeElement.clientHeight / this.pHeight).toString(), 10);
    this.book.subscribe(b => {
      if (!b) { return; }
      b.content = b.content.filter(v => v !== '');
      this.pages.next(b.content.length / this.numbersOfParagraphsPerPage);
      this.currentPageValue.next(b.content.slice(0, this.numbersOfParagraphsPerPage));
    });
  }
}
