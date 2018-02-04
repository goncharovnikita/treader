import {DomSanitizer} from '@angular/platform-browser';
import {Booker} from './../extenders/booker.class';
import {Component, ElementRef, OnInit, Output, ViewChild} from '@angular/core';
import {AddBookService} from './add-book.service';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';
import {Subject} from 'rxjs/Subject';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.sass']
})
export class AddBookComponent extends Booker implements OnInit {
  @Output() kill = new Subject<boolean>();
  @Output() bookLoaded = new Subject<boolean>();
  bookAdding = false;
  bookAdded = new Subject<boolean>();
  loadPercent = 0;
  @ViewChild('fileInput') private fileInputRef: ElementRef;
  private _subscription: Subscription;

  constructor(private $s: AddBookService, private $san: DomSanitizer) {
    super($san);
  }

  ngOnInit() {
    this.bookAdded.subscribe(() => {
      this.$s.triggerBooksToRefetch().subscribe(() => {
        Observable.timer(1000).subscribe(() => this.killSelf());
      });
    });

    this.bookAdded.subscribe(v => this.bookLoaded.next(v));
  }

  addBook() {
    this.bookAdding = true;
    this.$s.addBookToUser(this.book.getValue().ID).subscribe(v => {
      if (v) {
        return this.bookAdded.next(true);
      }
      this.bookAdding = false;
    });
  }

  onFileChange() {
    this.loadPercent = 100;
    this.$s.addBook(this.fileInputRef.nativeElement.files[0])
      .subscribe((r: LoadBookEvent) => {
        this.loadPercent = r.loadPercent;
        if (r.loaded) {
          this.book.next(r.result);
        }
      });
  }

  killSelf() {
    this.kill.next(true);
  }

  killFromModal(e: boolean) {
    this.killSelf();
  }
}
