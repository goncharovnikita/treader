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
  @Input() book: BehaviorSubject<Book>;
  @ViewChild('contentEl') contentRef: ElementRef;
  currentPageValue = new BehaviorSubject([]);
  currentPage = new BehaviorSubject(0);
  pages = new BehaviorSubject([[]]);
  totalPagesCount = 0;
  pHeight = 18;
  numbersOfParagraphsPerPage: number;
  constructor(
    private $s: ReaderService
  ) {}

  ngOnInit() {
    this.book.subscribe(b => {
      if (!b) { return; }
      b.content = b.content.filter(v => v !== '');
      this.pages.next(this.caclulatePageContent());
      this.totalPagesCount = this.pages.getValue().length;
      this.subscriptions();
    });
    this.addWindowListener();
  }

  subscriptions() {
    this.currentPage.subscribe(v => {
      this.currentPageValue.next(this.pages.getValue()[v]);
    });
  }

  splitWords(t: string) {
    return t.split('');
  }

  wordClicked(w: string) {
    console.log(w);
  }

  addWindowListener() {
    Observable.fromEvent(this.contentRef.nativeElement, 'click').subscribe(() => {
      const w = this.getClickedWord();
      console.log(w);
      this.replaceSelectedText('test');
    });
  }

  getClickedWord(): string {
    const s = window.getSelection();
    const range = s.getRangeAt(0);
    const node = s.anchorNode;
    while (range.toString().indexOf(' ') !== 0) {
      range.setStart(node, (range.startOffset - 1));
    }
    range.setStart(node, range.startOffset + 1);
    do {
      try {
        range.setEnd(node, range.endOffset + 1);
      } catch (e) {
        range.setEnd(node, range.endOffset - 1);
      }
    } while (range.toString().indexOf(' ') === -1 && range.toString().trim() !== '');
    const str = range.toString().trim();
    // s.removeRange(range);
    return str;
  }

  replaceSelectedText(replacementText) {
    let sel, range;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
            range = sel.getRangeAt(0);
            range.deleteContents();
            range.insertNode(document.createTextNode(replacementText));
        }
    } else if (document['selection'] && document['selection'].createRange) {
        range = document['selection'].createRange();
        range.text = replacementText;
    }
    sel = window.getSelection();
    sel.removeRange(range);
  }

  nextPage() {
    if (this.totalPagesCount > this.currentPage.getValue()) {
      this.currentPage.next(this.currentPage.getValue() + 1);
    }
  }

  previousPage() {
    if (this.currentPage.getValue() > 0) {
      this.currentPage.next(this.currentPage.getValue() - 1);
    }
  }

  caclulatePageContent(): string[][] {
    let restHeight = this.contentRef.nativeElement.clientHeight;
    const result = [];
    let currPage = [];
    const charWidth = 10;
    const width = this.contentRef.nativeElement.clientWidth;
    const pHeight = 18;
    for (const i of this.book.getValue().content) {
      const p = i.replace(/<\/?\w+>/g, '');
      restHeight -= (Math.floor(((p.length * charWidth) / width)) + 1) * pHeight;
      if (restHeight > 0) {
        currPage.push(i);
      } else {
        result.push(currPage);
        currPage = [];
        restHeight = this.contentRef.nativeElement.clientHeight;
      }
    }
    return result;
  }
}
