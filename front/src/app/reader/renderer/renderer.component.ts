import { ReaderService } from './../reader.service';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-reader-renderer',
  templateUrl: './renderer.component.html',
  styleUrls: ['./renderer.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RendererComponent implements OnInit {
  // @Input() sheet: Observable<BookSheet>;
  @Input() sheet: Observable<Array<string>>;

  constructor(
    private $s: ReaderService
  ) {}

  getWords(s: string): Array<string> {
    return s.split(' ');
  }

  handleClick($event) {
    this.translate($event.path[0].innerText).subscribe(r => $event.path[0].innerText = r);
  }

  translate(w: string): Observable<string> {
    return this.$s.translate(w);
  }

  ngOnInit() {}
}
